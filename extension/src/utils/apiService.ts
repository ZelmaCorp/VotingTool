// API Service for OpenGov VotingTool Extension

import type { ProposalData, InternalStatus, SuggestedVote, Chain } from '../types';

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
                }),
            });

            if (result.success && result.token) {
                this.saveToken(result.token);
            }

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
        }
    }

    async verifyToken(): Promise<{ valid: boolean; user?: any }> {
        if (!this.token) {
            return { valid: false };
        }

        try {
            const result = await this.request<{ valid: boolean; user?: any }>('/auth/verify');
            return result;
        } catch (error) {
            return { valid: false };
        }
    }

    // Proposal/Referendum methods
    async getProposal(postId: number, chain: Chain): Promise<ProposalData | null> {
        try {
            const result = await this.request<{ success: boolean; referendum?: ProposalData; error?: string }>(`/referendums/${postId}?chain=${chain}`);
            
            if (result.success && result.referendum) {
                return result.referendum;
            }
            
            return null;
        } catch (error) {
            console.error('Failed to fetch proposal:', error);
            return null;
        }
    }

    async updateProposalStatus(postId: number, chain: Chain, newStatus: InternalStatus, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/status`, {
                method: 'PUT',
                body: JSON.stringify({
                    chain,
                    internal_status: newStatus,
                    reason
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to update status' };
        }
    }

    async assignProposal(postId: number, chain: Chain, action: string): Promise<{ success: boolean; error?: string }> {
        try {
            // First, ensure the referendum exists in our database
            await this.ensureReferendumExists(postId, chain);

            const result = await this.request<{ success: boolean; error?: string }>(`/dao/referendum/${postId}/action`, {
                method: 'POST',
                body: JSON.stringify({
                    action,
                    chain  // Include chain information in the request
                }),
            });

            return result;
        } catch (error) {
            console.error('Failed to assign proposal:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Failed to assign proposal' };
        }
    }

    async getProposalAssignments(postId: number, chain: Chain): Promise<{ success: boolean; actions?: any[]; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; actions?: any[]; error?: string }>(`/dao/referendum/${postId}/actions?chain=${chain}`);
            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to get assignments' };
        }
    }

    async updatePersonalVote(postId: number, chain: Chain, vote: SuggestedVote, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; error?: string }>(`/referendums/${postId}/vote`, {
                method: 'PUT',
                body: JSON.stringify({
                    chain,
                    final_vote: vote,
                    reason_for_vote: reason
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to update vote' };
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