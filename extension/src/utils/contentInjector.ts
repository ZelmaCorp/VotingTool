// Content Injector for OpenGov VotingTool Extension
// Handles injection of UI components into Polkassembly/Subsquare pages

import { createApp, App as VueApp } from 'vue';
import VotingControls from '../components/VotingControls.vue';
import { ProposalDetector, type DetectedProposal } from './proposalDetector';
import { TabDetector, type ActiveTabInfo } from './tabDetector';
import { ApiService } from './apiService';
import type { ProposalData } from '../types';
import type { TeamMember } from '../types';

export class ContentInjector {
    private static instance: ContentInjector;
    private detector: ProposalDetector;
    private tabDetector: TabDetector;
    private apiService: ApiService;
    private injectedComponents: Map<number, VueApp> = new Map();
    private proposalCache: Map<string, ProposalData> = new Map();
    private cleanupFunctions: (() => void)[] = [];
    private isInjecting: boolean = false;
    private isInitialized: boolean = false;
    private currentProposalId: number | null = null;
    private controlsObserver: MutationObserver | null = null;
    private lastProposal: DetectedProposal | null = null;
    private lastProposalData: ProposalData | null = null;

    constructor() {
        this.detector = ProposalDetector.getInstance();
        this.tabDetector = TabDetector.getInstance();
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
        if (this.isInitialized) {
            console.log('ℹ️ Content injector already initialized, skipping...');
            return;
        }

        console.log('🚀 Initializing OpenGov VotingTool Content Injector');

        if (!this.detector.isSupportedSite()) {
            console.log('❌ Not on a supported site');
            return;
        }

        this.isInitialized = true;

        // Check initial page state
        await this.handlePageChange();

        // Watch for navigation changes
        const cleanup = this.detector.watchForChanges(async (proposal) => {
            await this.handlePageChange();
        });
        this.cleanupFunctions.push(cleanup);

        // Mutation observer removed - it was causing re-injection loops and blinking
        // The multiple initialization strategies (DOMContentLoaded, window.onload, retries) 
        // are sufficient for handling F5 refreshes and page loading scenarios
        console.log('ℹ️ Using initialization strategies without mutation observer to prevent blinking');

        // Listen for status change events from components
        window.addEventListener('statusChanged', this.handleStatusChange.bind(this) as EventListener);
        
        // Listen for voting controls events
        window.addEventListener('proposalAssigned', this.handleProposalAssigned.bind(this) as EventListener);
        window.addEventListener('proposalUnassigned', this.handleProposalUnassigned.bind(this) as EventListener);
        window.addEventListener('voteChanged', this.handleVoteChanged.bind(this) as EventListener);
        window.addEventListener('suggestedVoteChanged', this.handleSuggestedVoteChanged.bind(this) as EventListener);
        
        // Listen for authentication state changes
        window.addEventListener('authStateChanged', this.handleAuthStateChanged.bind(this) as EventListener);
        
        // Listen for wallet connection requests
        window.addEventListener('requestWalletConnection', this.handleWalletConnectionRequest.bind(this) as EventListener);

        console.log('✅ Content injector initialized');
    }

    /**
     * Handle tab changes and re-render badges if needed
     */
    private async handleTabChange(tabInfo: ActiveTabInfo): Promise<void> {
        console.log('🔄 Handling tab change:', tabInfo);
        
        // If we're on a category page, re-render all badges based on new tab state
        if (this.tabDetector.isOnCategoryPage()) {
            // Only clean up and re-inject if we're actually showing different content
            // Tab changes on the same proposal shouldn't remove the voting controls
            console.log('🔄 Tab change detected on category page, checking if re-injection needed');
            await this.handlePageChange();
        }
    }

    /**
     * Re-inject all components to reflect authentication changes
     */
    public async refreshAllComponents(): Promise<void> {
        console.log('🔄 Refreshing all components due to authentication change');
        await this.handlePageChange();
    }

    /**
     * Handle page changes and inject appropriate components
     */
    private async handlePageChange(): Promise<void> {
        console.log('📄 Page change detected, checking for proposals...');
        console.log('🔍 Current URL:', window.location.href);

        // Only clean up if we're actually changing to a different page/proposal
        // This prevents unnecessary removal and re-injection of the same components

        if (this.detector.isProposalPage()) {
            const proposal = this.detector.detectCurrentProposal();
            if (proposal) {
                console.log('📋 Detected single proposal:', proposal);
                
                // Only cleanup and re-inject if the proposal has changed
                if (this.currentProposalId !== proposal.postId) {
                    console.log(`🔄 Proposal changed from ${this.currentProposalId} to ${proposal.postId}, cleaning up...`);
                    this.cleanupExistingInjections();
                    this.currentProposalId = proposal.postId;
                    await this.injectProposalComponents(proposal);
                } else {
                    console.log(`✅ Same proposal ${proposal.postId}, skipping cleanup and re-injection`);
                }
            } else {
                console.log('❌ No proposal detected on proposal page');
                // If no proposal is detected but we had one before, cleanup
                if (this.currentProposalId !== null) {
                    console.log('🧹 No proposal detected, cleaning up previous injections');
                    this.cleanupExistingInjections();
                    this.currentProposalId = null;
                }
            }
        } else {
            // Not on a proposal detail page, cleanup any existing injections
            if (this.currentProposalId !== null || this.injectedComponents.size > 0) {
                console.log('🧹 Not on a proposal detail page, cleaning up injections');
                this.cleanupExistingInjections();
                this.currentProposalId = null;
            }
        }
    }

    /**
     * Inject components for a single proposal page
     */
    private async injectProposalComponents(proposal: DetectedProposal): Promise<void> {
        // Get proposal data from API
        const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
        
        // Check if this is a referenda detail page (matches pattern like /referenda/123)
        const referendaDetailPattern = /\/referenda\/\d+/;
        if (referendaDetailPattern.test(window.location.pathname)) {
            console.log('📋 Detected referenda detail page, injecting voting controls');
            
            // Add a small delay to ensure the page is fully rendered
            await sleep(500);
            
            await this.injectVotingControls(proposal, proposalData);
        }
        // Note: We no longer inject badges on list pages
    }

    /**
     * Find wrapper with retry logic
     */
    private async findRightWrapperWithRetry(): Promise<HTMLElement | null> {
        console.log('🔄 Starting aggressive retry mechanism for referenda page...');
        const maxRetries = 10;
        
        for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
            console.log(`🔄 Attempt ${retryCount}/${maxRetries} to find PostDetails_rightWrapper...`);
            
            if (retryCount > 1) {
                await sleep(1000);
            }
            
            const wrapper = this.findPostDetailsRightWrapper();
            if (wrapper) {
                console.log(`✅ Found element on attempt ${retryCount}!`);
                return wrapper;
            }
            
            console.log(`❌ Attempt ${retryCount} failed, element not found`);
        }
        
        return null;
    }

    /**
     * Create emergency fallback container
     */
    private createFallbackWrapper(): HTMLElement {
        console.error('💥 CRITICAL: PostDetails_rightWrapper not found after retries!');
        console.log('🆘 Creating emergency fallback container...');
        
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: fixed; top: 80px; right: 20px; z-index: 1000000;
            max-width: 400px; background: rgba(255, 0, 0, 0.9); color: white;
            backdrop-filter: blur(10px); border-radius: 12px; padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); border: 2px solid red;
        `;
        
        fallback.innerHTML = `<strong>⚠️ FALLBACK MODE</strong><br>Could not find page element.<br>Please report this issue.`;
        document.body.appendChild(fallback);
        
        return fallback;
    }

    /**
     * Fetch proposal metadata (assignment + team members)
     */
    private async fetchProposalMetadata(proposal: DetectedProposal, proposalData: ProposalData | null): Promise<{
        assignedTo: string | null;
        teamMembers: TeamMember[];
    }> {
        let assignedTo: string | null = proposalData?.assigned_to || null;
        let teamMembers: TeamMember[] = [];
        
        try {
            const agreementSummary = await this.apiService.getAgreementSummary(proposal.postId, proposal.chain);
            if (agreementSummary) {
                const allMembers = [
                    ...agreementSummary.agreed_members,
                    ...agreementSummary.pending_members,
                    ...agreementSummary.recused_members,
                    ...agreementSummary.to_be_discussed_members
                ];
                
                teamMembers = allMembers.filter((member, index, self) => 
                    index === self.findIndex(m => m.address === member.address)
                );
                console.log(`👥 Found ${teamMembers.length} team members`);
            }
        } catch (error) {
            console.warn('⚠️ Could not fetch metadata:', error);
        }
        
        return { assignedTo, teamMembers };
    }

    /**
     * Mount voting controls Vue app
     */
    private mountVotingControls(
        container: HTMLElement,
        proposal: DetectedProposal,
        proposalData: ProposalData | null,
        assignedTo: string | null,
        teamMembers: TeamMember[]
    ): void {
        const app = createApp(VotingControls, {
            status: proposalData?.internal_status || 'Not started',
            proposalId: proposal.postId,
            editable: this.apiService.isAuthenticated(),
            isAuthenticated: this.apiService.isAuthenticated(),
            suggestedVote: proposalData?.suggested_vote || null,
            reasonForVote: proposalData?.reason_for_vote || null,
            assignedTo,
            teamMembers,
            chain: proposal.chain
        });
        
        app.mount(container);
        this.injectedComponents.set(proposal.postId, app);
    }

    /**
     * Inject voting controls component for referenda detail pages
     */
    private async injectVotingControls(proposal: DetectedProposal, proposalData: ProposalData | null): Promise<void> {
        try {
            console.log('🎯 Injecting voting controls for proposal', proposal.postId);

            // Prevent duplicate injection
            if (this.isInjecting) {
                console.log('⚠️ Already injecting, skipping');
                return;
            }
            
            const existingControls = document.querySelector(`[data-opengov-proposal="${proposal.postId}"]`);
            if (existingControls) {
                console.log('⚠️ Controls already exist, skipping');
                return;
            }

            this.isInjecting = true;

            // Find or create wrapper
            let rightWrapper = await this.findRightWrapperWithRetry();
            if (!rightWrapper) {
                rightWrapper = this.createFallbackWrapper();
            }

            // Create container
            const container = document.createElement('div');
            container.id = 'voting-tool-controls-container';
            container.setAttribute('data-opengov-proposal', proposal.postId.toString());
            rightWrapper.insertBefore(container, rightWrapper.firstChild);

            // Fetch metadata and mount
            const { assignedTo, teamMembers } = await this.fetchProposalMetadata(proposal, proposalData);
            this.mountVotingControls(container, proposal, proposalData, assignedTo, teamMembers);

            // Store and protect
            this.lastProposal = proposal;
            this.lastProposalData = proposalData;
            this.setupVotingControlsProtection();

            console.log('✅ Injected voting controls');
        } catch (error) {
            console.error('❌ Error injecting controls:', error);
        } finally {
            this.isInjecting = false;
        }
    }

    /**
     * Protect voting controls from removal by page's DOM manipulations
     */
    private setupVotingControlsProtection(): void {
        // Disconnect existing observer if any
        if (this.controlsObserver) {
            this.controlsObserver.disconnect();
        }

        this.controlsObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach((node) => {
                        // Check if our voting controls container was removed
                        if (node instanceof Element && node.id === 'voting-tool-controls-container') {
                            console.warn('⚠️ Voting controls container was removed! Attempting recovery...');
                            
                            // Re-inject after a short delay
                            setTimeout(async () => {
                                const existing = document.getElementById('voting-tool-controls-container');
                                if (!existing && this.lastProposal && this.currentProposalId === this.lastProposal.postId) {
                                    console.log('🔄 Re-injecting voting controls...');
                                    await this.injectVotingControls(this.lastProposal, this.lastProposalData);
                                }
                            }, 200);
                        }
                    });
                }
            }
        });

        // Watch the entire page for removal
        this.controlsObserver.observe(document.body, {
            childList: true,
            subtree: true // Watch deeply for nested removals
        });

        console.log('🛡️ Voting controls protection activated');
    }

    /**
     * Find PostDetails_rightWrapper element with dynamic class names
     */
    private findPostDetailsRightWrapper(): HTMLElement | null {
        console.log('🔍 Looking for PostDetails_rightWrapper element...');
        
        // Try multiple selectors to find the right wrapper - ordered by likelihood
        const selectors = [
            // Most specific Polkassembly patterns first - these should match the dynamic classes
            '[class*="PostDetails_rightWrapper__"]', // More specific to avoid false matches
            '[class*="PostDetails_rightWrapper"]',
            '[class*="rightWrapper__"]', // Match generated class patterns
            '[class*="rightWrapper"]', 
            '[class*="right-wrapper"]',
            
            // Common layout patterns
            '.flex.flex-col.gap-6',
            '.flex.flex-col.space-y-6', 
            '.space-y-6',
            '.gap-6',
            
            // Grid-based layouts
            '.grid-cols-12 > div:last-child',
            '.col-12.col-lg-8',
            '.col-lg-8',
            '.col-lg-4', // Sometimes it's a 4-column layout
            '.col-md-8',
            '.col-md-4',
            
            // Generic right-side patterns
            '[class*="right-col"]',
            '[class*="rightCol"]',
            '[class*="right-side"]',
            '[class*="rightSide"]',
            '[class*="sidebar"]',
            '[class*="side-bar"]',
            
            // Main content area patterns
            'main .flex-col:last-child',
            'main > div > div:last-child',
            'main > div:last-child',
            '.container .row > div:last-child',
            '.container > div:last-child',
            
            // Flex-based patterns
            '.flex > div:last-child',
            '.flex-row > div:last-child',
            '.d-flex > div:last-child',
            
            // Generic content patterns
            '[class*="content"] > div:last-child',
            '[class*="wrapper"] > div:last-child',
            '.row > .col:last-child',
            '.row > div:last-child',
        ];

        // Debug: log what elements we can find
        console.log('🔍 Available elements on page:');
        const allDivs = document.querySelectorAll('div[class*="col"], div[class*="flex"], div[class*="grid"], div[class*="right"], div[class*="wrapper"]');
        console.log(`Found ${allDivs.length} potential wrapper elements`);
        
        for (let i = 0; i < Math.min(5, allDivs.length); i++) {
            const div = allDivs[i] as HTMLElement;
            console.log(`Element ${i}: ${div.tagName}.${div.className}`);
        }

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
            
            for (const element of elements) {
                const htmlElement = element as HTMLElement;
                
                // More flexible content verification - look for any meaningful content
                const hasTypicalContent = htmlElement.querySelector('[class*="card"]') || 
                                        htmlElement.querySelector('[class*="panel"]') ||
                                        htmlElement.querySelector('.bg-white') ||
                                        htmlElement.querySelector('[class*="border"]') ||
                                        htmlElement.querySelector('button') ||
                                        htmlElement.querySelector('[class*="vote"]') ||
                                        htmlElement.querySelector('[class*="details"]') ||
                                        htmlElement.querySelector('[class*="info"]') ||
                                        htmlElement.querySelector('[class*="summary"]') ||
                                        htmlElement.querySelector('[class*="description"]') ||
                                        htmlElement.querySelector('p') ||
                                        htmlElement.querySelector('div > div') || // Nested divs indicate structure
                                        htmlElement.textContent && htmlElement.textContent.trim().length > 30; // Reduced threshold
                
                // Check positioning and size
                const rect = htmlElement.getBoundingClientRect();
                const isReasonableSize = rect.width > 50 && rect.height > 50; // More lenient size requirements
                const isVisible = rect.width > 0 && rect.height > 0;
                
                console.log(`🔍 Element check: selector="${selector}"`);
                console.log(`    hasContent=${!!hasTypicalContent}, size=${rect.width}x${rect.height}, visible=${isVisible}`);
                console.log(`    classes="${htmlElement.className}"`);
                
                // Accept element if it has content and reasonable size, OR if it's specifically targeted
                const isSpecificTarget = selector.includes('PostDetails') || selector.includes('rightWrapper');
                
                if ((hasTypicalContent && isReasonableSize && isVisible) || (isSpecificTarget && isVisible)) {
                    console.log('🎯 Found PostDetails_rightWrapper with selector:', selector);
                    console.log('🎯 Element class:', htmlElement.className);
                    console.log('🎯 Element position:', { left: rect.left, width: rect.width, height: rect.height });
                    console.log('🎯 Element text preview:', htmlElement.textContent?.substring(0, 100));
                    return htmlElement;
                }
            }
        }

        // More aggressive fallback: look for any container with voting-related content
        console.log('🔍 Trying voting-related content fallback...');
        const votingContainers = document.querySelectorAll('[class*="vote"], [class*="detail"], [class*="info"]');
        for (const container of votingContainers) {
            const htmlElement = container as HTMLElement;
            const rect = htmlElement.getBoundingClientRect();
            
            if (rect.width > 200 && rect.height > 100) {
                console.log('🎯 Found voting-related container as fallback');
                console.log('🎯 Container class:', htmlElement.className);
                return htmlElement;
            }
        }

        // Final fallback: look for the largest container on the right side
        console.log('🔍 Trying largest right-side container fallback...');
        const allContainers = document.querySelectorAll('div');
        let bestContainer: HTMLElement | null = null;
        let bestScore = 0;
        
        for (const container of allContainers) {
            const htmlElement = container as HTMLElement;
            const rect = htmlElement.getBoundingClientRect();
            
            // Score based on size and position
            const score = rect.width * rect.height * (rect.left > window.innerWidth * 0.4 ? 2 : 1);
            
            if (score > bestScore && rect.width > 200 && rect.height > 200) {
                bestScore = score;
                bestContainer = htmlElement;
            }
        }
        
        if (bestContainer) {
            console.log('🎯 Found best container as final fallback');
            console.log('🎯 Best container class:', bestContainer.className);
            return bestContainer;
        }

        console.warn('❌ Could not find any suitable PostDetails_rightWrapper element');
        console.warn('❌ Page structure may be different than expected');
        return null;
    }

    /**
     * Update existing components with fresh data without full re-injection
     */
    private async updateExistingComponents(proposalId: number, proposalData: ProposalData | null): Promise<void> {
        console.log('🔄 Updating existing components with new data for proposal:', proposalId);
        
        try {
            // Get team members for name resolution
            let teamMembers: TeamMember[] = [];
            if (proposalData?.chain) {
                const agreementSummary = await this.apiService.getAgreementSummary(proposalId, proposalData.chain);
                if (agreementSummary) {
                    // Collect all unique team members from different arrays
                    const allMembers = [
                        ...agreementSummary.agreed_members,
                        ...agreementSummary.pending_members,
                        ...agreementSummary.recused_members,
                        ...agreementSummary.to_be_discussed_members
                    ];
                    
                    // Remove duplicates by address
                    teamMembers = allMembers.filter((member, index, self) => 
                        index === self.findIndex(m => m.address === member.address)
                    );
                }
            }
            
            // Unmount existing component if it exists
            const existingApp = this.injectedComponents.get(proposalId);
            if (existingApp) {
                existingApp.unmount();
                this.injectedComponents.delete(proposalId);
            }
            
            // Find the container
            const container = document.getElementById('voting-tool-controls-container');
            if (!container) {
                console.warn('⚠️ Could not find controls container for update');
                return;
            }
            
            // Create new app with updated data
            const app = createApp(VotingControls, {
                status: proposalData?.internal_status || 'Not started',
                proposalId: proposalId,
                editable: this.apiService.isAuthenticated(),
                isAuthenticated: this.apiService.isAuthenticated(),
                suggestedVote: proposalData?.suggested_vote || null,
                reasonForVote: proposalData?.reason_for_vote || null,
                assignedTo: proposalData?.assigned_to || null,
                teamMembers: teamMembers,
                chain: proposalData?.chain || 'Polkadot'
            });
            
            app.mount(container);
            this.injectedComponents.set(proposalId, app);
            
            console.log('✅ Updated existing component with fresh data');
            
        } catch (error) {
            console.error('❌ Error updating existing components:', error);
        }
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
        
        console.log('📝 Status change event received:', customEvent.detail);
        console.log('🔄 Refreshing UI after status change...');
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for status change');
                return;
            }

            // Clear cache to ensure fresh data is fetched
            const cacheKey = `${currentProposal.chain}-${proposalId}`;
            this.proposalCache.delete(cacheKey);
            
            // Get fresh proposal data and update UI immediately
            const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
            await this.updateExistingComponents(proposalId, updatedProposalData);
            
            console.log('✅ UI refreshed successfully after status change');
            
        } catch (error) {
            console.error('❌ Failed to refresh UI after status change:', error);
        }
    }

    /**
     * Handle proposal assignment events from components
     */
    private async handleProposalAssigned(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, action, autoStatus } = customEvent.detail;
        
        console.log('👤 Proposal assignment requested:', customEvent.detail);
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for assignment');
                return;
            }

            // Check if user is authenticated
            if (!this.apiService.isAuthenticated()) {
                console.error('User not authenticated for assignment');
                alert('Please authenticate to assign proposals');
                return;
            }

            // Call the assignment API
            const result = await this.apiService.assignProposal(
                proposalId, 
                currentProposal.chain
            );
            
            if (result.success) {
                console.log('✅ Proposal assigned successfully');
                
                // If autoStatus is specified, also update the status
                if (autoStatus) {
                    console.log(`🔄 Auto-updating status to: ${autoStatus}`);
                    const statusResult = await this.apiService.updateProposalStatus(
                        proposalId,
                        currentProposal.chain,
                        autoStatus
                    );
                    
                    if (statusResult.success) {
                        console.log('✅ Status auto-updated successfully');
                    } else {
                        console.error('❌ Failed to auto-update status:', statusResult.error);
                    }
                }
                
                // Clear cache to ensure fresh data is fetched
                const cacheKey = `${currentProposal.chain}-${proposalId}`;
                this.proposalCache.delete(cacheKey);
                
                // Get fresh proposal data and update UI immediately
                const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
                
                // Update existing component props instead of full re-injection
                await this.updateExistingComponents(proposalId, updatedProposalData);
                
            } else {
                console.error('❌ Failed to assign proposal:', result.error);
                alert(`Failed to assign proposal: ${result.error || 'Unknown error'}`);
            }
            
        } catch (error) {
            console.error('❌ Failed to assign proposal:', error);
            alert('Failed to assign proposal. Please check your connection and try again.');
        }
    }

    /**
     * Handle suggested vote changes from components
     */
    private async handleSuggestedVoteChanged(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, vote, reason } = customEvent.detail;
        
        console.log('🗳️ Suggested vote change event received:', customEvent.detail);
        console.log('🔄 Refreshing UI after vote change...');
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for vote change');
                return;
            }

            // Clear cache to ensure fresh data is fetched
            const cacheKey = `${currentProposal.chain}-${proposalId}`;
            this.proposalCache.delete(cacheKey);
            
            // Get fresh proposal data and update UI immediately
            const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
            await this.updateExistingComponents(proposalId, updatedProposalData);
            
            console.log('✅ UI refreshed successfully after vote change');
            
        } catch (error) {
            console.error('❌ Failed to refresh UI after vote change:', error);
        }
    }

    /**
     * Handle wallet connection requests from components
     */
    private handleWalletConnectionRequest(event: Event): void {
        console.log('🔗 Wallet connection requested from component');
        
        // Find the floating hamburger button and trigger it
        const hamburgerButton = document.querySelector('.floating-button') as HTMLElement;
        if (hamburgerButton) {
            hamburgerButton.click();
            console.log('✅ Opened wallet connection menu');
        } else {
            console.warn('⚠️ Could not find floating hamburger button');
            // Fallback: show a simple alert
            alert('Please click the pink floating button in the bottom-right corner to connect your wallet.');
        }
    }

    /**
     * Handle authentication state changes
     */
    private async handleAuthStateChanged(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { isAuthenticated } = customEvent.detail;
        
        console.log('🔐 Authentication state changed:', isAuthenticated);
        
        // Refresh all components to reflect the new authentication state
        await this.refreshAllComponents();
    }

    /**
     * Handle proposal unassignment events from components
     */
    private async handleProposalUnassigned(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, chain, note } = customEvent.detail;
        
        console.log('👤 Proposal unassignment event received:', customEvent.detail);
        console.log('🔄 Refreshing UI after unassignment...');
        
        try {
            // Clear cache to ensure fresh data is fetched
            const cacheKey = `${chain}-${proposalId}`;
            this.proposalCache.delete(cacheKey);
            
            // Get fresh proposal data and update UI immediately
            const updatedProposalData = await this.getProposalData(proposalId, chain);
            await this.updateExistingComponents(proposalId, updatedProposalData);
            
            console.log('✅ UI refreshed successfully after unassignment');
            
        } catch (error) {
            console.error('❌ Failed to refresh UI after unassignment:', error);
        }
    }

    /**
     * Handle vote change events from components
     */
    private async handleVoteChanged(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, vote, reason } = customEvent.detail;
        
        console.log('🗳️ Final vote change requested:', customEvent.detail);
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for vote change');
                return;
            }

            // Check if user is authenticated
            if (!this.apiService.isAuthenticated()) {
                console.error('User not authenticated for vote change');
                alert('Please authenticate to change final votes');
                return;
            }

            // Update final vote via API
            const result = await this.apiService.updateFinalVote(
                proposalId,
                currentProposal.chain,
                vote,
                reason
            );

            if (result.success) {
                console.log('✅ Final vote updated successfully');
                
                // Clear cache to ensure fresh data is fetched
                const cacheKey = `${currentProposal.chain}-${proposalId}`;
                this.proposalCache.delete(cacheKey);
                
                // Get fresh proposal data and update UI immediately
                const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
                await this.updateExistingComponents(proposalId, updatedProposalData);
                
            } else {
                console.error('❌ Failed to update final vote:', result.error);
                alert(`Failed to update final vote: ${result.error || 'Unknown error'}`);
            }
            
        } catch (error) {
            console.error('❌ Failed to update final vote:', error);
            alert('Failed to update final vote. Please check your connection and try again.');
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

        // Remove injected DOM elements (status badges and voting controls)
        document.querySelectorAll('.opengov-status-badge, .opengov-status-badge-floating').forEach(element => {
            // Remove the wrapper if it exists
            const wrapper = element.parentElement;
            if (wrapper && wrapper.style.position === 'absolute' && wrapper.style.left === '-110px') {
                wrapper.remove();
            } else {
                element.remove();
            }
        });

        // Remove voting controls and fallback containers
        document.querySelectorAll('#voting-tool-controls, #voting-tool-controls-container').forEach(element => {
            // If it's in a fallback container we created, remove the whole container
            const parent = element.parentElement;
            if (parent && parent.style.position === 'fixed' && parent.style.right === '20px') {
                parent.remove();
            } else {
                element.remove();
            }
        });

        // Restore original overflow properties
        document.querySelectorAll('[data-opengov-original-overflow-x]').forEach(element => {
            const htmlElement = element as HTMLElement;
            const originalOverflowX = element.getAttribute('data-opengov-original-overflow-x');
            const originalOverflow = element.getAttribute('data-opengov-original-overflow');
            const originalOverflowY = element.getAttribute('data-opengov-original-overflow-y');
            
            if (originalOverflowX) {
                htmlElement.style.removeProperty('overflow-x');
                htmlElement.style.overflowX = originalOverflowX;
                element.removeAttribute('data-opengov-original-overflow-x');
            }
            
            if (originalOverflow) {
                htmlElement.style.removeProperty('overflow');
                htmlElement.style.overflow = originalOverflow;
                element.removeAttribute('data-opengov-original-overflow');
            }
            
            if (originalOverflowY) {
                htmlElement.style.removeProperty('overflow-y');
                htmlElement.style.overflowY = originalOverflowY;
                element.removeAttribute('data-opengov-original-overflow-y');
            }
        });
    }

    /**
     * Clean up all resources
     */
    cleanup(): void {
        this.cleanupExistingInjections();
        
        // Disconnect protection observer
        if (this.controlsObserver) {
            this.controlsObserver.disconnect();
            this.controlsObserver = null;
        }
        
        // Clean up event listeners and watchers
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        
        // Clear injection flag
        this.isInjecting = false;
        
        window.removeEventListener('statusChanged', this.handleStatusChange.bind(this) as EventListener);
        window.removeEventListener('proposalAssigned', this.handleProposalAssigned.bind(this) as EventListener);
        window.removeEventListener('proposalUnassigned', this.handleProposalUnassigned.bind(this) as EventListener);
        window.removeEventListener('voteChanged', this.handleVoteChanged.bind(this) as EventListener);
        window.removeEventListener('suggestedVoteChanged', this.handleSuggestedVoteChanged.bind(this) as EventListener);
        window.removeEventListener('authStateChanged', this.handleAuthStateChanged.bind(this) as EventListener);
        window.removeEventListener('requestWalletConnection', this.handleWalletConnectionRequest.bind(this) as EventListener);
        
        // Clear caches
        this.proposalCache.clear();
        
        // Reset initialization state
        this.isInitialized = false;
        this.currentProposalId = null;
        this.lastProposal = null;
        this.lastProposalData = null;
        
        console.log('🧹 Content injector cleaned up');
    }
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}