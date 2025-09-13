// API Service for OpenGov VotingTool Extension

import type { ProposalData, InternalStatus, SuggestedVote, Chain, TeamAction, ProposalAction, ProposalComment, AgreementSummary, DAOConfig } from '../types';

export class ApiService {
    private static instance: ApiService;
    private baseUrl: string;
    private token: string | null = null;

    constructor() {
        // Default to localhost, but this could be configurable
        this.baseUrl = 'http://localhost:3000';
        this.loadToken();
    }

    static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private loadToken(): void {
        this.token = localStorage.getItem('opengov-auth-token');
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
                
                if (response && response.success) {
                    resolve(response.data);
                } else {
                    console.error('❌ API Service: API call failed, response:', response);
                    
                    // Handle 401 unauthorized
                    if (response?.debugInfo?.responseStatus === 401) {
                        this.token = null;
                        localStorage.removeItem('opengov-auth-token');
                    }
                    
                    const error = new Error(response?.error || 'API call failed');
                    // Attach additional details for better error handling
                    if (response?.debugInfo?.errorResponseBody?.details) {
                        (error as any).details = response.debugInfo.errorResponseBody.details;
                        (error as any).status = response?.debugInfo?.responseStatus;
                    }
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
            
            const result = await this.request<{ success: boolean; error?: string }>(`/dao/referendum/${postId}/action`, {
                method: 'POST',
                body: JSON.stringify({
                    chain,
                    action: backendAction,
                    reason
                }),
            });

            return result;
        } catch (error) {
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
            const result = await this.request<{ success: boolean; config?: DAOConfig; error?: string }>('/dao/config');
            return result.config || null;
        } catch (error) {
            console.error('Failed to fetch DAO config:', error);
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

    // List methods for different views
    async getMyAssignments(): Promise<ProposalData[]> {
        try {
            const result = await this.request<{ success: boolean; referendums?: ProposalData[]; error?: string }>('/dao/my-assignments');
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
            const queryParam = chain ? `?chain=${chain}` : '';
            const result = await this.request<{ success: boolean; referendums?: ProposalData[]; error?: string }>(`/referendums${queryParam}`);
            return result.referendums || [];
        } catch (error) {
            console.error('Failed to fetch all proposals:', error);
            return [];
        }
    }

    async getUnassignedProposals(): Promise<ProposalData[]> {
        try {
            const result = await this.request<{ success: boolean; referendums?: ProposalData[]; error?: string }>('/dao/unassigned');
            return result.referendums || [];
        } catch (error) {
            console.error('Failed to fetch unassigned proposals:', error);
            return [];
        }
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

    // Helper method to trigger referendum refresh
    private async refreshReferenda(): Promise<void> {
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