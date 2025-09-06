// Content Injector for OpenGov VotingTool Extension
// Handles injection of UI components into Polkassembly/Subsquare pages

import { createApp, App as VueApp } from 'vue';
import StatusBadge from '../components/StatusBadge.vue';
import { ProposalDetector, type DetectedProposal } from './proposalDetector';
import { ApiService } from './apiService';
import type { ProposalData, InternalStatus } from '../types';

export class ContentInjector {
    private static instance: ContentInjector;
    private detector: ProposalDetector;
    private apiService: ApiService;
    private injectedComponents: Map<number, VueApp> = new Map();
    private proposalCache: Map<string, ProposalData> = new Map();
    private cleanupFunctions: (() => void)[] = [];

    constructor() {
        this.detector = ProposalDetector.getInstance();
        this.apiService = ApiService.getInstance();
    }

    static getInstance(): ContentInjector {
        if (!ContentInjector.instance) {
            ContentInjector.instance = new ContentInjector();
        }
        return ContentInjector.instance;
    }

    /**
     * Initialize the content injector
     */
    async initialize(): Promise<void> {
        console.log('🚀 Initializing OpenGov VotingTool Content Injector');

        if (!this.detector.isSupportedSite()) {
            console.log('❌ Not on a supported site');
            return;
        }

        // Check initial page
        await this.handlePageChange();

        // Watch for navigation changes
        const cleanup = this.detector.watchForChanges(async (proposal) => {
            await this.handlePageChange();
        });
        this.cleanupFunctions.push(cleanup);

        // Listen for status change events from components
        window.addEventListener('statusChanged', this.handleStatusChange.bind(this) as EventListener);

        console.log('✅ Content injector initialized');
    }

    /**
     * Handle page changes and inject appropriate components
     */
    private async handlePageChange(): Promise<void> {
        console.log('📄 Page change detected, checking for proposals...');

        // Clean up existing injections first
        this.cleanupExistingInjections();

        if (this.detector.isProposalPage()) {
            const proposal = this.detector.detectCurrentProposal();
            if (proposal) {
                console.log('📋 Detected proposal:', proposal);
                await this.injectProposalComponents(proposal);
            }
        } else {
            // Check for proposal lists
            const proposals = this.detector.detectProposalsOnListPage();
            if (proposals.length > 0) {
                console.log('📋 Detected proposals on list page:', proposals.length);
                await this.injectListPageComponents(proposals);
            }
        }
    }

    /**
     * Inject components for a single proposal page
     */
    private async injectProposalComponents(proposal: DetectedProposal): Promise<void> {
        // Get proposal data from API
        const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
        
        // Inject status badge
        await this.injectStatusBadge(proposal, proposalData);
        
        // TODO: Inject other components (assignment display, quick vote indicators)
        // await this.injectAssignmentDisplay(proposal, proposalData);
        // await this.injectQuickVoteIndicators(proposal, proposalData);
    }

    /**
     * Inject components for proposal list pages
     */
    private async injectListPageComponents(proposals: DetectedProposal[]): Promise<void> {
        for (const proposal of proposals) {
            const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
            
            // Inject status badge for each proposal in the list
            await this.injectStatusBadge(proposal, proposalData);
        }
    }

    /**
     * Inject status badge component
     */
    private async injectStatusBadge(proposal: DetectedProposal, proposalData: ProposalData | null): Promise<void> {
        if (!proposal.headerElement) {
            console.warn('No header element found for proposal', proposal.postId);
            return;
        }

        // Check if already injected
        const existingBadge = proposal.headerElement.querySelector('.opengov-status-badge');
        if (existingBadge) {
            return;
        }

        // Create container for the status badge
        const container = document.createElement('div');
        container.className = 'opengov-status-badge';
        container.style.cssText = `
            display: inline-block;
            margin-left: 8px;
            vertical-align: middle;
        `;

        // Determine the best insertion point
        const insertionPoint = this.findStatusBadgeInsertionPoint(proposal.headerElement);
        if (insertionPoint) {
            insertionPoint.appendChild(container);
        } else {
            proposal.headerElement.appendChild(container);
        }

        // Create Vue app and mount the StatusBadge component
        const app = createApp(StatusBadge, {
            status: proposalData?.internal_status || 'Not started',
            proposalId: proposal.postId,
            editable: this.apiService.isAuthenticated()
        });

        app.mount(container);

        // Store the app instance for cleanup
        this.injectedComponents.set(proposal.postId, app);

        console.log('✅ Injected status badge for proposal', proposal.postId);
    }

    /**
     * Find the best insertion point for status badge within the header
     */
    private findStatusBadgeInsertionPoint(headerElement: HTMLElement): HTMLElement | null {
        // Look for title element within the header
        const titleElement = headerElement.querySelector('h1, h2, h3, [class*="title"]') as HTMLElement;
        if (titleElement) {
            // Try to find a container that wraps the title
            let container = titleElement.parentElement;
            while (container && container !== headerElement) {
                // If we find a flex or inline container, use it
                const style = window.getComputedStyle(container);
                if (style.display.includes('flex') || style.display.includes('inline')) {
                    return container;
                }
                container = container.parentElement;
            }
            
            // Fallback to title's parent
            return titleElement.parentElement;
        }
        
        return null;
    }

    /**
     * Get proposal data from API with caching
     */
    private async getProposalData(postId: number, chain: 'Polkadot' | 'Kusama'): Promise<ProposalData | null> {
        const cacheKey = `${chain}-${postId}`;
        
        // Check cache first
        if (this.proposalCache.has(cacheKey)) {
            return this.proposalCache.get(cacheKey) || null;
        }

        // Fetch from API
        const proposalData = await this.apiService.getProposal(postId, chain);
        
        // Cache the result
        if (proposalData) {
            this.proposalCache.set(cacheKey, proposalData);
        }
        
        return proposalData;
    }

    /**
     * Handle status change events from components
     */
    private async handleStatusChange(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, newStatus, reason } = customEvent.detail;
        
        console.log('📝 Status change requested:', customEvent.detail);
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for status change');
                return;
            }

            // Update status via API
            const result = await this.apiService.updateProposalStatus(
                proposalId,
                currentProposal.chain,
                newStatus,
                reason
            );

            if (result.success) {
                // Update cache
                const cacheKey = `${currentProposal.chain}-${proposalId}`;
                const cachedData = this.proposalCache.get(cacheKey);
                if (cachedData) {
                    cachedData.internal_status = newStatus;
                    this.proposalCache.set(cacheKey, cachedData);
                }

                // Re-inject components to reflect the change
                await this.handlePageChange();
                
                console.log('✅ Status updated successfully');
            } else {
                console.error('❌ Failed to update status:', result.error);
                // TODO: Show error message to user
            }
        } catch (error) {
            console.error('❌ Error updating status:', error);
            // TODO: Show error message to user
        }
    }

    /**
     * Clean up existing injections
     */
    private cleanupExistingInjections(): void {
        // Unmount Vue apps
        this.injectedComponents.forEach((app, postId) => {
            try {
                app.unmount();
            } catch (error) {
                console.warn('Error unmounting app for proposal', postId, error);
            }
        });
        this.injectedComponents.clear();

        // Remove injected DOM elements
        document.querySelectorAll('.opengov-status-badge').forEach(element => {
            element.remove();
        });
    }

    /**
     * Clean up all resources
     */
    cleanup(): void {
        this.cleanupExistingInjections();
        
        // Clean up event listeners and watchers
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        
        window.removeEventListener('statusChanged', this.handleStatusChange.bind(this) as EventListener);
        
        // Clear caches
        this.proposalCache.clear();
        
        console.log('🧹 Content injector cleaned up');
    }
} 