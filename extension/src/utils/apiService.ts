// API Service for OpenGov VotingTool Extension
// Updated for Multi-DAO Support
//
// Key Changes:
// - Stores and uses multisig address to identify DAO context (multi-DAO support)
// - Sends X-Multisig-Address header with all requests for DAO identification
// - Authentication now uses /auth/web3-login endpoint
// - DAO sync uses /dao/sync endpoint (replaces /admin/refresh-referendas)
// - Agreement summary is now calculated by backend at /referendums/:postId/agreement-summary
// - All endpoints automatically filter by DAO context via addDaoContext middleware
// - DAO configuration and members retrieved from blockchain multisig data
//
// Multi-DAO Architecture:
// - Extension connects to ONE DAO instance at a time (identified by multisig address)
// - Backend database can store multiple DAOs
// - User authentication links wallet to DAO membership
// - All API calls are scoped to the user's DAO

import type { ProposalData, InternalStatus, SuggestedVote, Chain, TeamAction, ProposalAction, ProposalComment, AgreementSummary, DAOConfig, TeamMember } from '../types';

export class ApiService {
    private static instance: ApiService;
    private baseUrl: string;
    private token: string | null = null;
    private multisigAddress: string | null = null; // DAO identification

    constructor() {
        // Default to localhost, will be updated from storage
        this.baseUrl = 'http://localhost:3000';
        this.loadToken();
        this.loadMultisigAddress();
        this.loadApiConfig();
        this.setupConfigListener();
    }

    private async loadApiConfig() {
        try {
            const result = await chrome.storage.sync.get(['backendUrl']);
            if (result.backendUrl) {
                this.baseUrl = result.backendUrl;
            }
        } catch (error) {
            console.warn('ApiService: Failed to load API config, using default:', error);
        }
    }

    private setupConfigListener() {
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'sync' && changes.backendUrl) {
                this.baseUrl = changes.backendUrl.newValue;
            }
        });

        // Also listen for custom events from the UI
        window.addEventListener('backend-url-changed', (event: Event) => {
            const customEvent = event as CustomEvent;
            this.baseUrl = customEvent.detail.url;
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

    private loadMultisigAddress(): void {
        this.multisigAddress = localStorage.getItem('opengov-multisig-address');
        console.log('🏛️ Loaded multisig address:', this.multisigAddress ? 'Present' : 'Not found');
    }

    // Method to refresh token from localStorage
    public refreshToken(): void {
        this.loadToken();
    }

    private saveToken(token: string): void {
        this.token = token;
        localStorage.setItem('opengov-auth-token', token);
    }

    public setMultisigAddress(multisigAddress: string): void {
        this.multisigAddress = multisigAddress;
        localStorage.setItem('opengov-multisig-address', multisigAddress);
        console.log('🏛️ Set multisig address:', multisigAddress);
    }

    public getMultisigAddress(): string | null {
        return this.multisigAddress;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Add multisig address for DAO context (multi-DAO support)
        if (this.multisigAddress) {
            headers['X-Multisig-Address'] = this.multisigAddress;
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
            const result = await this.request<{ success: boolean; token?: string; user?: any; error?: string }>('/auth/web3-login', {
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
            
            // If token is valid and we don't have a multisig address yet, try to fetch it
            if (result.success && result.valid && !this.multisigAddress && result.user?.address) {
                // We could try to auto-detect the DAO here, but for now just log
                console.log('✅ Token verified but no multisig address set');
            }
            
            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Token verification failed' };
        }
    }

    // Get user profile from backend
    async getUserProfile(): Promise<{ success: boolean; user?: any; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; user?: any; error?: string }>('/auth/profile');
            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to get user profile' };
        }
    }

    // Proposal CRUD methods
    async getProposal(postId: number, chain: Chain): Promise<ProposalData | null> {
        try {
            const result = await this.request<{ success: boolean; referendum?: ProposalData; error?: string }>(`/referendums/${postId}?chain=${chain}`);
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

    async assignProposal(postId: number, chain: Chain): Promise<{ success: boolean; error?: string; message?: string }> {
        try {
            if (!this.multisigAddress) {
                return {
                    success: false,
                    error: 'No multisig address set. Please configure your DAO first.'
                };
            }

            const result = await this.request<{ success: boolean; error?: string; message?: string }>(`/referendums/${postId}/assign`, {
                method: 'POST',
                body: JSON.stringify({ chain }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to assign proposal' };
        }
    }



    async updateSuggestedVote(postId: number, chain: Chain, vote: SuggestedVote, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/${chain}`, {
                method: 'PUT',
                body: JSON.stringify({
                    suggested_vote: vote,
                    reason_for_vote: reason // Store reason in referendums table
                }),
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to update suggested vote');
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to update suggested vote:', error);
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
            
            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/actions`, {
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

    async deleteTeamAction(postId: number, chain: Chain, action: TeamAction): Promise<{ success: boolean; error?: string }> {
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

            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/actions`, {
                method: 'DELETE',
                body: JSON.stringify({
                    chain,
                    action: backendAction
                }),
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to delete team action');
            }

            return result;
        } catch (error) {
            console.error('❌ Failed to delete team action:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Failed to delete team action' };
        }
    }

    async unassignFromReferendum(postId: number, chain: Chain, unassignNote?: string): Promise<{ success: boolean; error?: string; message?: string }> {
        try {
            if (!this.multisigAddress) {
                return {
                    success: false,
                    error: 'No multisig address set. Please configure your DAO first.'
                };
            }

            const result = await this.request<{ success: boolean; error?: string; message?: string }>(`/referendums/${postId}/unassign`, {
                method: 'POST',
                body: JSON.stringify({
                    chain,
                    unassignNote
                }),
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to unassign from referendum');
            }

            return result;
        } catch (error) {
            console.error('❌ Failed to unassign from referendum:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Failed to unassign from referendum' };
        }
    }

    async getTeamActions(postId: number, chain: Chain): Promise<ProposalAction[]> {
        try {
            // Get team actions from the referendums endpoint
            const result = await this.request<{ success: boolean; actions?: ProposalAction[]; error?: string }>(
                `/referendums/${postId}/actions?chain=${chain}`
            );

            if (!result.success) {
                console.error('Failed to fetch team actions:', result.error);
                return [];
            }

            // Map backend action types to frontend types
            const mappedActions = (result.actions || []).map(action => ({
                ...action,
                role_type: this.mapBackendActionToFrontend(action.role_type as string)
            }));

            console.log('📝 Team actions loaded:', {
                postId,
                chain,
                rawActions: result.actions,
                mappedActions
            });

            return mappedActions;
        } catch (error) {
            console.error('Failed to fetch team actions:', error);
            return [];
        }
    }

    async getAgreementSummary(postId: number, chain: Chain): Promise<AgreementSummary | null> {
        try {
            const result = await this.request<{ success: boolean; summary?: AgreementSummary; error?: string }>(
                `/referendums/${postId}/agreement-summary?chain=${chain}`
            );
            
            return result.success && result.summary ? result.summary : null;
        } catch (error) {
            console.error('Failed to fetch agreement summary:', error);
            return null;
        }
    }

    async addComment(postId: number, chain: Chain, content: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/comments`, {
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
            const result = await this.request<{ success: boolean; comments?: ProposalComment[]; error?: string }>(`/referendums/${postId}/comments?chain=${chain}`);
            return result.comments || [];
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            return [];
        }
    }

    async deleteComment(commentId: number): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/comments/${commentId}`, {
                method: 'DELETE'
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to delete comment' };
        }
    }

    // DAO configuration methods
    async getDAOConfig(chain?: Chain): Promise<DAOConfig | null> {
        try {
            // NOTE: Backend auto-detects DAO from token if multisig not provided
            // So it's OK to call this without multisig being set
            if (!this.multisigAddress) {
                console.log('📡 Fetching DAO config (multisig not set yet, backend will auto-detect)');
            }

            const queryParam = chain ? `?chain=${chain}` : '';
            const configResult = await this.request<{ success: boolean; config?: DAOConfig; error?: string }>(`/dao/config${queryParam}`);
            
            if (configResult.success && configResult.config) {
                console.log('✅ DAO config received:', configResult.config.name);
                return configResult.config;
            }

            console.warn('Failed to get DAO config:', configResult.error);
                return null;
        } catch (error) {
            console.error('Error getting DAO config:', error);
            return null;
        }
    }

    // Get DAO information (basic info without sensitive data)
    async getDAOInfo(daoId: number): Promise<any | null> {
        try {
            const result = await this.request<{ success: boolean; dao?: any; error?: string }>(`/dao/${daoId}`);
            
            if (result.success && result.dao) {
                return result.dao;
            }

            return null;
        } catch (error) {
            console.error('Error getting DAO info:', error);
            return null;
        }
    }

    // Get DAO statistics
    async getDAOStats(daoId: number): Promise<any | null> {
        try {
            const result = await this.request<{ success: boolean; stats?: any; error?: string }>(`/dao/${daoId}/stats`);
            
            if (result.success && result.stats) {
                return result.stats;
            }

            return null;
        } catch (error) {
            console.error('Error getting DAO stats:', error);
            return null;
        }
    }

    // Get DAO team members (multisig members)
    async getTeamMembers(chain?: Chain): Promise<TeamMember[]> {
        try {
            const queryParam = chain ? `?chain=${chain}` : '';
            const result = await this.request<{ success: boolean; members?: TeamMember[]; error?: string }>(`/dao/members${queryParam}`);
            
            if (result.success && result.members) {
                return result.members;
            }

            return [];
        } catch (error) {
            console.error('Error getting team members:', error);
            return [];
        }
    }

    // Register a new DAO
    async registerDAO(params: {
        name: string;
        description?: string;
        polkadotMultisig?: string;
        kusamaMultisig?: string;
        walletAddress: string;
        signature: string;
        message: string;
    }): Promise<{ success: boolean; dao?: any; message?: string; error?: string; errors?: string[] }> {
        try {
            const result = await this.request<{ 
                success: boolean; 
                dao?: any; 
                message?: string; 
                error?: string;
                errors?: string[];
            }>('/dao/register', {
                method: 'POST',
                body: JSON.stringify(params)
            });

            if (result.success && result.dao) {
                console.log('✅ DAO registered successfully:', result.dao);
                // Set the multisig address for this DAO
                const multisigAddress = params.polkadotMultisig || params.kusamaMultisig;
                if (multisigAddress) {
                    this.setMultisigAddress(multisigAddress);
                }
            }

            return result;
        } catch (error) {
            console.error('Error registering DAO:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to register DAO' 
            };
        }
    }


    // List methods for different views
    // Note: getMyAssignments() removed - now using proposalStore.myAssignments instead
    // Note: getProposalsByStatus() removed - backend doesn't support status query parameter

    async getAllProposals(chain?: Chain): Promise<ProposalData[]> {
        try {
            console.log('🔍 getAllProposals called', { 
                chain, 
                baseUrl: this.baseUrl, 
                hasToken: !!this.token,
                multisigAddress: this.multisigAddress 
            });
            
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

            // Map backend action types to frontend types
            const proposals = result.referendums.map(proposal => {
                const mappedProposal = {
                    ...proposal,
                    team_actions: proposal.team_actions?.map(action => {
                        const mappedAction = {
                            ...action,
                            role_type: this.mapBackendActionToFrontend(action.role_type as string)
                        };
                        return mappedAction;
                    })
                };
                
                return mappedProposal;
            });
            
            console.log(`✅ Loaded ${proposals.length} proposals for DAO`);
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

    // Note: getRecentActivity() removed - backend doesn't support sort/limit query parameters
    // Use proposalStore.state.proposals and filter/sort in frontend if needed

    // Team workflow data method
    async getTeamWorkflowData(chain?: Chain): Promise<{
        needsAgreement: ProposalData[];
        readyToVote: ProposalData[];
        forDiscussion: ProposalData[];
        vetoedProposals: ProposalData[];
    }> {
        try {
            // NOTE: Backend auto-detects DAO from token if multisig not provided
            if (!this.multisigAddress) {
                console.log('📡 Fetching workflow data (multisig not set yet, backend will auto-detect)');
            }

            const queryParam = chain ? `?chain=${chain}` : '';
                const result = await this.request<{
                    success: boolean;
                    data?: {
                        needsAgreement: ProposalData[];
                        readyToVote: ProposalData[];
                        forDiscussion: ProposalData[];
                        vetoedProposals: ProposalData[];
                    };
                    error?: string;
            }>(`/dao/workflow${queryParam}`);
                
                if (result.success && result.data) {
                console.log('✅ Got team workflow data from backend:', {
                    needsAgreement: result.data.needsAgreement.length,
                    readyToVote: result.data.readyToVote.length,
                    forDiscussion: result.data.forDiscussion.length,
                    vetoedProposals: result.data.vetoedProposals.length
                });
                    return result.data;
            }

            console.warn('Failed to get workflow data:', result.error);
            return {
                needsAgreement: [],
                readyToVote: [],
                forDiscussion: [],
                vetoedProposals: []
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

    // Method to trigger referendum refresh from Polkassembly
    // Supports 'normal' (30 refs) and 'deep' (100 refs) sync types
    async refreshReferenda(type: 'normal' | 'deep' = 'normal'): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            if (!this.multisigAddress) {
                return {
                    success: false,
                    error: 'No multisig address set. Please configure your DAO first.'
                };
            }

            const result = await this.request<{ success: boolean; message?: string; type?: string; limit?: number; timestamp?: string; status?: string; error?: string }>(
                '/dao/sync',
                { 
                    method: 'POST',
                    body: JSON.stringify({ type })
                }
            );
            
            console.log('Referendum refresh request sent:', result);
            
            if (result.success) {
            return { 
                success: true, 
                    message: result.message || 'Sync started successfully' 
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Sync failed'
                };
            }
        } catch (refreshError) {
            console.warn('Could not refresh referenda:', refreshError);
            const errorMessage = refreshError instanceof Error ? refreshError.message : 'Failed to refresh referenda';
            return { 
                success: false, 
                error: errorMessage 
            };
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
        this.multisigAddress = null;
        localStorage.removeItem('opengov-auth-token');
        localStorage.removeItem('opengov-multisig-address');
    }

    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }
}