// API Service for OpenGov VotingTool Extension

import type { ProposalData, InternalStatus, SuggestedVote, Chain, TeamAction, ProposalAction, ProposalComment, AgreementSummary, DAOConfig, TeamMember } from '../types';

export class ApiService {
    private static instance: ApiService;
    private baseUrl: string;
    private token: string | null = null;

    constructor() {
        // Default to localhost, but this could be configurable
        this.baseUrl = 'http://localhost:3000';
        this.loadToken();
        console.log('🔧 ApiService initialized:', {
            baseUrl: this.baseUrl,
            hasToken: !!this.token
        });
    }

    static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private loadToken(): void {
        this.token = localStorage.getItem('opengov-auth-token');
        console.log('🔑 Loaded token:', this.token ? 'Present' : 'Not found');
    }

    // Method to refresh token from localStorage
    public refreshToken(): void {
        this.loadToken();
    }

    private saveToken(token: string): void {
        this.token = token;
        localStorage.setItem('opengov-auth-token', token);
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Use background script to make API calls (bypasses CSP)
        return new Promise((resolve, reject) => {
            const headers = {
                ...this.getHeaders(),
                ...options.headers,
            };
            
            const messageId = Date.now().toString();
            
            chrome.runtime.sendMessage({
                type: 'VOTING_TOOL_API_CALL',
                messageId,
                endpoint,
                method: options.method || 'GET',
                data: options.body ? JSON.parse(options.body as string) : undefined,
                headers
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('❌ API Service: Chrome runtime error:', chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                            console.log('📡 Chrome message response:', response);
                
                if (response && response.success) {
                console.log('✅ API call successful, raw response:', response);
                // Always use the data field from the response
                    resolve(response.data);
                } else {
                    console.error('❌ API Service: API call failed, response:', response);
                    
                    // Handle 401 unauthorized
                    if (response?.debugInfo?.responseStatus === 401) {
                    console.warn('⚠️ Unauthorized - clearing token');
                        this.token = null;
                        localStorage.removeItem('opengov-auth-token');
                    }
                    
                    const error = new Error(response?.error || 'API call failed');
                    // Attach additional details for better error handling
                    if (response?.debugInfo?.errorResponseBody?.details) {
                        (error as any).details = response.debugInfo.errorResponseBody.details;
                        (error as any).status = response?.debugInfo?.responseStatus;
                    }
                console.error('❌ Rejecting with error:', error);
                    reject(error);
                }
            });
        });
    }

    // Authentication methods
    async authenticate(address: string, signature: string, message: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; token?: string; user?: any; error?: string }>('/auth/authenticate', {
                method: 'POST',
                body: JSON.stringify({
                    address,
                    signature,
                    message,
                    timestamp: Date.now()
                })
            });

            if (result.success && result.token) {
                this.saveToken(result.token);
            }

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
        }
    }

    async verifyToken(): Promise<{ success: boolean; valid?: boolean; user?: any; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; valid?: boolean; user?: any; error?: string }>('/auth/verify');
            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Token verification failed' };
        }
    }

    // Proposal CRUD methods
    async getProposal(postId: number, chain: Chain): Promise<ProposalData | null> {
        try {
            const result = await this.request<{ success: boolean; referendum?: ProposalData; error?: string }>(`/dao/referendum/${postId}?chain=${chain}`);
            return result.referendum || null;
        } catch (error) {
            console.error('Failed to fetch proposal:', error);
            return null;
        }
    }

    async updateProposalStatus(postId: number, chain: Chain, status: InternalStatus): Promise<{ success: boolean; error?: string }> {
        try {
            console.log(`🔄 Updating status: PUT /referendums/${postId}/${chain}`, { internal_status: status });
            console.log(`🔐 Auth token present: ${!!this.token}`);
            
            const updatedReferendum = await this.request<any>(`/referendums/${postId}/${chain}`, {
                method: 'PUT',
                body: JSON.stringify({
                    internal_status: status
                }),
            });

            console.log('✅ Status update result:', updatedReferendum);
            
            if (updatedReferendum && updatedReferendum.internal_status === status) {
                return { success: true };
            } else {
                return { success: false, error: 'Status update did not apply correctly' };
            }
        } catch (error) {
            console.error('❌ Status update error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Failed to update status' };
        }
    }

    async assignProposal(postId: number, chain: Chain, action: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/dao/referendum/${postId}/action`, {
                method: 'POST',
                body: JSON.stringify({
                    chain,
                    action
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to assign proposal' };
        }
    }



    async updateSuggestedVote(postId: number, chain: Chain, vote: SuggestedVote, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<any>(`/referendums/${postId}/${chain}`, {
                method: 'PUT',
                body: JSON.stringify({
                    suggested_vote: vote,
                    reason_for_vote: reason // Store reason in referendums table
                }),
            });

            // The endpoint returns the updated referendum object, not { success: boolean }
            // If we get a referendum object back, it means success
            if (result && result.id) {
                return { success: true };
            } else {
                return { success: false, error: 'No referendum data returned' };
            }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to update suggested vote' };
        }
    }

    async updateFinalVote(postId: number, chain: Chain, vote: SuggestedVote, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/${chain}`, {
                method: 'PUT',
                body: JSON.stringify({
                    final_vote: vote,
                    reason_for_vote: reason
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to update vote' };
        }
    }

    // New team collaboration methods
    async submitTeamAction(postId: number, chain: Chain, action: TeamAction, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Map frontend action names to backend enum values
            const actionMap: Record<TeamAction, string> = {
                'Agree': 'agree',
                'To be discussed': 'to_be_discussed',
                'NO WAY': 'no_way',
                'Recuse': 'recuse'
            };
            
            const backendAction = actionMap[action];
            if (!backendAction) {
                return { success: false, error: `Unknown action: ${action}` };
            }
            
            console.log('🔄 Submitting team action:', {
                postId,
                chain,
                action,
                backendAction,
                reason
            });
            
            const result = await this.request<{ success: boolean; error?: string }>(`/dao/referendum/${postId}/action`, {
                method: 'POST',
                body: JSON.stringify({
                    chain,
                    action: backendAction,
                    reason
                }),
            });

            console.log('✅ Team action result:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to submit team action:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Failed to submit team action' };
        }
    }

    async deleteTeamAction(postId: number, chain: Chain): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/dao/referendum/${postId}/action`, {
                method: 'DELETE',
                body: JSON.stringify({
                    chain
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to delete team action' };
        }
    }

    async getTeamActions(postId: number, chain: Chain): Promise<ProposalAction[]> {
        try {
            const result = await this.request<{ success: boolean; actions?: ProposalAction[]; error?: string }>(`/dao/referendum/${postId}/actions?chain=${chain}`);
            return result.actions || [];
        } catch (error) {
            console.error('Failed to fetch team actions:', error);
            return [];
        }
    }

    async getAgreementSummary(postId: number, chain: Chain): Promise<AgreementSummary | null> {
        try {
            const result = await this.request<{ success: boolean; summary?: AgreementSummary; error?: string }>(`/dao/referendum/${postId}/agreement-summary?chain=${chain}`);
            return result.summary || null;
        } catch (error) {
            console.error('Failed to fetch agreement summary:', error);
            return null;
        }
    }

    async addComment(postId: number, chain: Chain, content: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/dao/referendum/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({
                    chain,
                    content
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to add comment' };
        }
    }

    async getComments(postId: number, chain: Chain): Promise<ProposalComment[]> {
        try {
            const result = await this.request<{ success: boolean; comments?: ProposalComment[]; error?: string }>(`/dao/referendum/${postId}/comments?chain=${chain}`);
            return result.comments || [];
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            return [];
        }
    }

    async deleteComment(commentId: number): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/dao/comments/${commentId}`, {
                method: 'DELETE'
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to delete comment' };
        }
    }

    // DAO configuration methods
    async getDAOConfig(): Promise<DAOConfig | null> {
        try {
            // Use /dao/members endpoint instead of /dao/config
            const result = await this.request<{ success: boolean; members?: TeamMember[]; error?: string }>('/dao/members');
            
            if (result.success && result.members) {
                const config: DAOConfig = {
                    team_members: result.members,
                    required_agreements: 4, // Default value, could be made configurable
                    name: 'OpenGov Voting Tool' // Simple static name
                };
                return config;
            } else {
                console.error('Failed to get DAO config:', result.error)
                return null;
            }
        } catch (error) {
            console.error('Error getting DAO config:', error)
            return null;
        }
    }

    async updateDAOConfig(config: Partial<DAOConfig>): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>('/dao/config', {
                method: 'PUT',
                body: JSON.stringify(config)
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to update DAO config' };
        }
    }

    async triggerSync(type: 'normal' | 'deep' = 'normal'): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const result = await this.request<{ 
                success: boolean; 
                message?: string; 
                type?: string;
                limit?: number;
                timestamp?: string;
                status?: string;
                error?: string 
            }>('/dao/sync', {
                method: 'POST',
                body: JSON.stringify({ type })
            });

            return {
                success: result.success,
                message: result.message,
                error: result.error
            };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to trigger sync' 
            };
        }
    }



    // List methods for different views
    async getMyAssignments(): Promise<ProposalData[]> {
        try {
            const result = await this.request<{ success: boolean; referendums: ProposalData[]; error?: string }>('/dao/my-assignments');
            
            if (!result.success) {
                console.warn('API returned success: false', result.error);
                return [];
            }

            return result.referendums || [];
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
            return [];
        }
    }

    async getProposalsByStatus(status: InternalStatus): Promise<ProposalData[]> {
        try {
            const result = await this.request<{ success: boolean; referendums?: ProposalData[]; error?: string }>(`/referendums/status/${encodeURIComponent(status)}`);
            return result.referendums || [];
        } catch (error) {
            console.error('Failed to fetch proposals by status:', error);
            return [];
        }
    }

    async getAllProposals(chain?: Chain): Promise<ProposalData[]> {
        try {
            console.log('🔍 getAllProposals called', { chain, baseUrl: this.baseUrl, hasToken: !!this.token });
            const queryParam = chain ? `?chain=${chain}` : '';
            const endpoint = `/referendums${queryParam}`;
            console.log('📡 Making request to:', endpoint);
            
            const result = await this.request<{ success: boolean; referendums: ProposalData[] }>(endpoint);
            console.log('📦 Raw API result:', result);
            
            if (!result.success) {
                console.warn('⚠️ API returned success: false');
                return [];
            }

            // Log full structure of first proposal
            if (result.referendums.length > 0) {
                console.log('📝 First proposal structure:', {
                    proposal: result.referendums[0],
                    keys: Object.keys(result.referendums[0]),
                    hasTeamActions: 'team_actions' in result.referendums[0],
                    teamActionsType: result.referendums[0].team_actions ? typeof result.referendums[0].team_actions : 'undefined'
                });
            }

            // Check if team_actions might be under a different key
            const sampleProposal = result.referendums[0];
            if (sampleProposal) {
                console.log('🔍 Looking for team actions in proposal keys:', Object.keys(sampleProposal));
                // Log any keys that might contain team actions
                Object.entries(sampleProposal).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        console.log(`📦 Array found in key "${key}":`, value);
                    }
                });
            }

            // Log raw team actions before mapping
            const proposalsWithActions = result.referendums.filter(p => {
                const hasActions = p.team_actions && p.team_actions.length > 0;
                if (!hasActions && p.team_actions !== undefined) {
                    console.log(`⚠️ Proposal ${p.post_id} has team_actions but it's empty:`, p.team_actions);
                }
                return hasActions;
            });
            console.log('👥 Proposals with team actions:', proposalsWithActions.length);
            console.log('📝 Team actions breakdown:', proposalsWithActions.map(p => ({
                id: p.post_id,
                rawActions: p.team_actions
            })));

            // Map backend action types to frontend types
            const proposals = result.referendums.map(proposal => {
                const mappedProposal = {
                    ...proposal,
                    team_actions: proposal.team_actions?.map(action => {
                        const mappedAction = {
                            ...action,
                            role_type: this.mapBackendActionToFrontend(action.role_type as string)
                        };
                        console.log(`🔄 Mapping action for proposal ${proposal.post_id}:`, {
                            from: action.role_type,
                            to: mappedAction.role_type
                        });
                        return mappedAction;
                    })
                };
                
                // Log if proposal has NO WAY actions
                if (mappedProposal.team_actions?.some(a => a.role_type === 'NO WAY')) {
                    console.log('🚫 Found NO WAY action in proposal:', {
                        id: mappedProposal.post_id,
                        actions: mappedProposal.team_actions
                    });
                }
                
                return mappedProposal;
            });
            
            return proposals;
        } catch (error) {
            console.error('❌ Failed to fetch all proposals:', error);
            return [];
        }
    }

    private mapBackendActionToFrontend(action: string): TeamAction {
        console.log('🔄 Mapping action:', action);
        const mapped = (() => {
            switch (action.toLowerCase()) {
                case 'no_way':
                case 'noway':
                case 'no way':
                    return 'NO WAY';
                case 'to_be_discussed':
                case 'tobediscussed':
                case 'to be discussed':
                    return 'To be discussed';
                case 'agree':
                    return 'Agree';
                case 'recuse':
                    return 'Recuse';
                default:
                    console.warn('⚠️ Unknown team action type:', action);
                    return 'To be discussed';
            }
        })();
        console.log(`🔄 Mapped ${action} -> ${mapped}`);
        return mapped;
    }

    async getRecentActivity(): Promise<ProposalData[]> {
        try {
            const result = await this.request<{ success: boolean; referendums?: ProposalData[]; error?: string }>('/referendums?sort=updated_at&limit=50');
            return result.referendums || [];
        } catch (error) {
            console.error('Failed to fetch recent activity:', error);
            return [];
        }
    }

    async getProposalsNeedingAttention(): Promise<ProposalData[]> {
        try {
            const result = await this.request<{ success: boolean; referendums?: ProposalData[]; error?: string }>('/dao/needs-attention');
            return result.referendums || [];
        } catch (error) {
            console.error('Failed to fetch proposals needing attention:', error);
            return [];
        }
    }

    // Team workflow data method
    async getTeamWorkflowData(): Promise<{
        needsAgreement: ProposalData[];
        readyToVote: ProposalData[];
        forDiscussion: ProposalData[];
        vetoedProposals: ProposalData[];
    }> {
        try {
            // Try to get data from specific endpoint if it exists
            try {
                const result = await this.request<{
                    success: boolean;
                    data?: {
                        needsAgreement: ProposalData[];
                        readyToVote: ProposalData[];
                        forDiscussion: ProposalData[];
                        vetoedProposals: ProposalData[];
                    };
                    error?: string;
                }>('/dao/workflow');
                
                if (result.success && result.data) {
                    console.log('✅ Got team workflow data from backend endpoint:', result.data);
                    return result.data;
                }
            } catch (endpointError) {
                console.warn('Team workflow endpoint failed:', endpointError);
            }

            // Better fallback: try to get all proposals with team actions
            let allProposals: ProposalData[] = [];
            
            try {
                // Try to get all proposals instead of specific filtered ones
                const allProposalsResult = await this.request<{ 
                    success: boolean; 
                    referendums?: ProposalData[]; 
                    error?: string; 
                }>('/dao/proposals');
                
                if (allProposalsResult.success && allProposalsResult.referendums) {
                    allProposals = allProposalsResult.referendums;
                    console.log('✅ Got all proposals from /dao/proposals:', allProposals.length);
                }
            } catch (error) {
                console.warn('Could not get all proposals, trying individual methods');
                
                // Fallback: use only reliable methods and handle errors gracefully
                const proposals: ProposalData[] = [];
                
                // Try each method individually and handle failures
                try {
                    const assignments = await this.getMyAssignments();
                    proposals.push(...assignments);
                } catch (error) {
                    console.warn('getMyAssignments failed:', error);
                }
                
                try {
                    const needingAttention = await this.getProposalsNeedingAttention();
                    proposals.push(...needingAttention);
                } catch (error) {
                    console.warn('getProposalsNeedingAttention failed:', error);
                }
                
                allProposals = proposals;
            }

            // Deduplicate proposals
            const uniqueProposals = allProposals.filter((proposal, index, self) => 
                index === self.findIndex(p => p.post_id === proposal.post_id && p.chain === proposal.chain)
            );

            console.log('🔍 Team Workflow Debug - Total unique proposals:', uniqueProposals.length);
            console.log('🔍 Sample proposal data:', uniqueProposals.slice(0, 3).map(p => ({
                id: p.post_id,
                status: p.internal_status,
                agreement_count: p.agreement_count,
                required_agreements: p.required_agreements,
                team_actions: p.team_actions?.map(a => ({ role_type: a.role_type, member: a.team_member_name }))
            })));
            
            console.log('🔍 ALL proposal IDs found:', uniqueProposals.map(p => `${p.post_id}-${p.chain}`));
            console.log('🔍 ALL proposal statuses:', uniqueProposals.map(p => `${p.post_id}: ${p.internal_status}`));

            // Categorize proposals based on their status and team actions
            const needsAgreement = uniqueProposals.filter(p => {
                // Proposals that need team agreement
                const hasVeto = p.team_actions?.some(action => action.role_type === 'no_way');
                const isInConsiderationPhase = ['Considering', 'Ready for approval', 'Waiting for agreement'].includes(p.internal_status);
                
                return !hasVeto && isInConsiderationPhase;
            });
            
            const readyToVote = uniqueProposals.filter(p => {
                // Proposals that are ready to vote
                const hasVeto = p.team_actions?.some(action => action.role_type === 'no_way');
                const isReadyStatus = p.internal_status === 'Ready to vote';
                
                return !hasVeto && isReadyStatus;
            });
            
            const forDiscussion = uniqueProposals.filter(p => {
                // Proposals marked for discussion or reconsidering
                const markedForDiscussion = p.team_actions?.some(action => action.role_type === 'to_be_discussed');
                const isReconsidering = p.internal_status === 'Reconsidering';
                
                return markedForDiscussion || isReconsidering;
            });
            
            const vetoedProposals = uniqueProposals.filter(p => {
                // Proposals that have been vetoed (NO WAY)
                return p.team_actions?.some(action => action.role_type === 'no_way');
            });

            console.log('🔍 Categorization Results:', {
                needsAgreement: needsAgreement.length,
                readyToVote: readyToVote.length,
                forDiscussion: forDiscussion.length,
                vetoedProposals: vetoedProposals.length,
                total: uniqueProposals.length
            });
            
            console.log('🔍 Detailed breakdown:', {
                needsAgreement: needsAgreement.map(p => `${p.post_id}: ${p.internal_status}`),
                readyToVote: readyToVote.map(p => `${p.post_id}: ${p.internal_status}`),
                forDiscussion: forDiscussion.map(p => `${p.post_id}: ${p.internal_status}`),
                vetoedProposals: vetoedProposals.map(p => `${p.post_id}: ${p.internal_status}`)
            });

            return {
                needsAgreement,
                readyToVote,
                forDiscussion,
                vetoedProposals
            };

        } catch (error) {
            console.error('Failed to fetch team workflow data:', error);
            return {
                needsAgreement: [],
                readyToVote: [],
                forDiscussion: [],
                vetoedProposals: []
            };
        }
    }

    // Helper method to ensure referendum exists in database
    private async ensureReferendumExists(postId: number, chain: Chain): Promise<void> {
        try {
            // Try to fetch the referendum first
            const existing = await this.getProposal(postId, chain);
            
            if (existing) {
                return; // Referendum exists, nothing to do
            }
            
            // Referendum doesn't exist, try to refresh from Polkassembly
            console.log(`Referendum ${postId} not found, attempting to refresh from Polkassembly...`);
            await this.refreshReferenda();
            
        } catch (error) {
            // If it's a 404, the referendum doesn't exist yet - try to refresh it
            if (error instanceof Error && error.message.includes('404')) {
                console.log(`Referendum ${postId} not found (404), attempting to refresh from Polkassembly...`);
                await this.refreshReferenda();
            } else {
                console.warn('Could not ensure referendum exists:', error);
                throw error;
            }
        }
    }

    // Method to trigger referendum refresh from Polkassembly
    async refreshReferenda(): Promise<void> {
        try {
            await this.request(`/admin/refresh-referendas?limit=50`, {
                method: 'GET'
            });
            console.log('Referendum refresh request sent');
        } catch (refreshError) {
            console.warn('Could not refresh referenda:', refreshError);
            throw new Error('Referendum not found and could not be refreshed. Please try again in a moment.');
        }
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        try {
            return await this.request<{ status: string; timestamp: string }>('/health');
        } catch (error) {
            return { status: 'error', timestamp: new Date().toISOString() };
        }
    }

    // Utility methods
    isAuthenticated(): boolean {
        return !!this.token;
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('opengov-auth-token');
    }

    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }
} 