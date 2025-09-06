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
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                this.token = null;
                localStorage.removeItem('opengov-auth-token');
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
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
                    action
                }),
            });

            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to assign proposal' };
        }
    }

    async getProposalAssignments(postId: number): Promise<{ success: boolean; actions?: any[]; error?: string }> {
        try {
            const result = await this.request<{ success: boolean; actions?: any[]; error?: string }>(`/dao/referendum/${postId}/actions`);
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
            
            if (!existing) {
                // If it doesn't exist, try to create it by triggering a refresh
                await this.request(`/admin/refresh-referendas`, {
                    method: 'POST',
                    body: JSON.stringify({ chain, post_id: postId })
                });
            }
        } catch (error) {
            console.warn('Could not ensure referendum exists:', error);
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