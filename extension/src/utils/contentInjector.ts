// Content Injector for OpenGov VotingTool Extension
// Handles injection of UI components into Polkassembly/Subsquare pages

import { createApp, App as VueApp } from 'vue';
import StatusBadge from '../components/StatusBadge.vue';
import VotingControls from '../components/VotingControls.vue';
import { ProposalDetector, type DetectedProposal } from './proposalDetector';
import { TabDetector, type ActiveTabInfo } from './tabDetector';
import { ApiService } from './apiService';
import type { ProposalData, InternalStatus } from '../types';

export class ContentInjector {
    private static instance: ContentInjector;
    private detector: ProposalDetector;
    private tabDetector: TabDetector;
    private apiService: ApiService;
    private injectedComponents: Map<number, VueApp> = new Map();
    private proposalCache: Map<string, ProposalData> = new Map();
    private cleanupFunctions: (() => void)[] = [];
    private currentActiveTab: ActiveTabInfo | null = null;

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
        console.log('🚀 Initializing OpenGov VotingTool Content Injector');

        if (!this.detector.isSupportedSite()) {
            console.log('❌ Not on a supported site');
            return;
        }

        // Check initial page and tab state
        this.currentActiveTab = this.tabDetector.detectActiveTab();
        await this.handlePageChange();

        // Watch for navigation changes
        const cleanup = this.detector.watchForChanges(async (proposal) => {
            await this.handlePageChange();
        });
        this.cleanupFunctions.push(cleanup);

        // Watch for tab changes
        const tabCleanup = this.tabDetector.watchForTabChanges(async (tabInfo) => {
            console.log('🔄 Tab change detected:', tabInfo);
            this.currentActiveTab = tabInfo;
            await this.handleTabChange(tabInfo);
        });
        this.cleanupFunctions.push(tabCleanup);

        // Listen for status change events from components
        window.addEventListener('statusChanged', this.handleStatusChange.bind(this) as EventListener);
        
        // Listen for voting controls events
        window.addEventListener('proposalAssigned', this.handleProposalAssigned.bind(this) as EventListener);
        window.addEventListener('voteChanged', this.handleVoteChanged.bind(this) as EventListener);

        console.log('✅ Content injector initialized');
    }

    /**
     * Handle tab changes and re-render badges if needed
     */
    private async handleTabChange(tabInfo: ActiveTabInfo): Promise<void> {
        console.log('🔄 Handling tab change:', tabInfo);
        
        // If we're on a category page, re-render all badges based on new tab state
        if (this.tabDetector.isOnCategoryPage()) {
            // Clean up existing injections and re-inject based on new tab state
            this.cleanupExistingInjections();
            await this.handlePageChange();
        }
    }

    /**
     * Handle page changes and inject appropriate components
     */
    private async handlePageChange(): Promise<void> {
        console.log('📄 Page change detected, checking for proposals...');
        console.log('🔍 Current URL:', window.location.href);

        // Clean up existing injections first
        this.cleanupExistingInjections();

        if (this.detector.isProposalPage()) {
            const proposal = this.detector.detectCurrentProposal();
            if (proposal) {
                console.log('📋 Detected single proposal:', proposal);
                await this.injectProposalComponents(proposal);
            } else {
                console.log('❌ No proposal detected on proposal page');
            }
        } else {
            // Check for proposal lists
            console.log('🔍 Searching for table rows with selectors: tr.border-b, tr[class*="border"]');
            const tableRows = document.querySelectorAll('tr.border-b, tr[class*="border"]');
            console.log('📊 Found table rows:', tableRows.length);
            
            // Debug: let's see what links are in these rows
            tableRows.forEach((tr, index) => {
                const links = tr.querySelectorAll('a[href*="/referendum/"], a[href*="/proposal/"], a[href*="/referenda/"]');
                if (links.length > 0) {
                    console.log(`TR ${index} has ${links.length} proposal links:`, Array.from(links).map(l => (l as HTMLAnchorElement).href));
                }
            });

            while (this.detector.isStillLoading()) {
                // wait for 1 second
                await sleep(1000);
                console.log('🔍 Still loading, waiting for 1 second...');
            }

            const proposals = this.detector.detectProposalsOnListPage();
            
            if (proposals.length > 0) {
                console.log('📋 Detected proposals on list page:', proposals.length);
                proposals.forEach((p, index) => {
                    console.log(`  Proposal ${index}: #${p.postId} - ${p.title.substring(0, 50)}...`);
                });
                await this.injectListPageComponents(proposals);
            } else {
                console.log('❌ No proposals detected on list page');
                // Debug: let's see what elements are actually on the page
                const allTrs = document.querySelectorAll('tr');
                console.log('🔍 All TR elements found:', allTrs.length);
                const allLinks = document.querySelectorAll('a[href*="/referendum/"], a[href*="/proposal/"], a[href*="/referenda/"]');
                console.log('🔍 All proposal links found:', allLinks.length);
                
                allLinks.forEach((link, index) => {
                    if (index < 5) { // Log first 5 for debugging
                        console.log(`Link ${index}:`, (link as HTMLAnchorElement).href);
                    }
                });
            }
        }
    }

    /**
     * Inject components for a single proposal page
     */
    private async injectProposalComponents(proposal: DetectedProposal): Promise<void> {
        // Get proposal data from API
        const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
        
        // Check if we're on a category page and should show badges
        if (this.tabDetector.isOnCategoryPage()) {
            const currentTab = this.currentActiveTab || this.tabDetector.detectActiveTab();
            if (!currentTab.shouldShowBadges) {
                console.log(`⏸️ Not showing badge for single proposal - active tab "${currentTab.activeCategory}" is not tracked`);
                return;
            }
        }
        
        // Check if this is a referenda detail page (matches pattern like /referenda/123)
        const referendaDetailPattern = /\/referenda\/\d+/;
        if (referendaDetailPattern.test(window.location.pathname)) {
            console.log('📋 Detected referenda detail page, injecting voting controls');
            console.log('🔍 URL:', window.location.pathname);
            await this.injectVotingControls(proposal, proposalData);
        } else {
            // For other proposal pages, inject status badge
            await this.injectStatusBadge(proposal, proposalData);
        }
    }

    /**
     * Inject components for proposal list pages
     */
    private async injectListPageComponents(proposals: DetectedProposal[]): Promise<void> {
        console.log(`🚀 Starting injection for ${proposals.length} proposals`);
        
        // Check if we should show badges based on current active tab
        const currentTab = this.currentActiveTab || this.tabDetector.detectActiveTab();
        
        if (!currentTab.shouldShowBadges) {
            console.log(`⏸️ Not showing badges - active tab "${currentTab.activeCategory}" is not tracked`);
            return;
        }
        
        console.log(`✅ Showing badges - active tab "${currentTab.activeCategory}" is tracked`);
        
        for (let i = 0; i < proposals.length; i++) {
            const proposal = proposals[i];
            console.log(`📌 Processing proposal ${i + 1}/${proposals.length}: #${proposal.postId}`);
            
            try {
                const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
                
                // Inject status badge for each proposal in the list
                await this.injectStatusBadge(proposal, proposalData);
                console.log(`✅ Successfully injected badge for proposal #${proposal.postId}`);
            } catch (error) {
                console.error(`❌ Failed to inject badge for proposal #${proposal.postId}:`, error);
            }
        }
        
        console.log(`🎉 Completed injection for all ${proposals.length} proposals`);
    }

    /**
     * Inject voting controls component for referenda detail pages
     */
    private async injectVotingControls(proposal: DetectedProposal, proposalData: ProposalData | null): Promise<void> {
        console.log('🎯 Injecting voting controls for proposal', proposal.postId);

        // Check if already injected
        const existingControls = document.querySelector('#voting-tool-controls');
        if (existingControls) {
            console.log('⚠️ Voting controls already exist, skipping');
            return;
        }

        // Find PostDetails_rightWrapper element - it might have dynamic class names
        const rightWrapper = this.findPostDetailsRightWrapper();
        if (!rightWrapper) {
            console.warn('❌ PostDetails_rightWrapper not found, cannot inject voting controls');
            return;
        }

        console.log('✅ Found PostDetails_rightWrapper:', rightWrapper.className);

        // Create container for voting controls
        const container = document.createElement('div');
        container.id = 'voting-tool-controls-container';
        container.setAttribute('data-opengov-proposal', proposal.postId.toString());
        
        // Insert at the top of the right wrapper
        rightWrapper.insertBefore(container, rightWrapper.firstChild);

        // Create Vue app and mount the VotingControls component
        const app = createApp(VotingControls, {
            status: proposalData?.internal_status || 'Not started',
            proposalId: proposal.postId,
            editable: this.apiService.isAuthenticated(),
            isAuthenticated: this.apiService.isAuthenticated()
        });

        app.mount(container);

        // Store the app instance for cleanup
        this.injectedComponents.set(proposal.postId, app);

        console.log('✅ Injected voting controls for proposal', proposal.postId);
    }

    /**
     * Find PostDetails_rightWrapper element with dynamic class names
     */
    private findPostDetailsRightWrapper(): HTMLElement | null {
        // Try multiple selectors to find the right wrapper
        const selectors = [
            '[class*="PostDetails_rightWrapper"]',
            '[class*="rightWrapper"]',
            '[class*="right-wrapper"]',
            '.flex.flex-col.gap-6', // Common Tailwind pattern
            '.flex.flex-col.space-y-6',
            '.grid-cols-12 > div:last-child', // If it's in a grid layout
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
                // Verify this looks like the right wrapper by checking for typical content
                const hasTypicalContent = element.querySelector('[class*="card"]') || 
                                        element.querySelector('[class*="panel"]') ||
                                        element.querySelector('.bg-white') ||
                                        element.querySelector('[class*="border"]');
                
                if (hasTypicalContent) {
                    console.log('🎯 Found PostDetails_rightWrapper with selector:', selector);
                    return element;
                }
            }
        }

        // Fallback: look for flex containers on the right side of the page
        const flexContainers = document.querySelectorAll('.flex.flex-col');
        for (const container of flexContainers) {
            const rect = container.getBoundingClientRect();
            // Check if it's on the right side of the page (more than 60% from left)
            if (rect.left > window.innerWidth * 0.6 && rect.width > 200) {
                console.log('🎯 Found right-side flex container as fallback');
                return container as HTMLElement;
            }
        }

        console.warn('❌ Could not find PostDetails_rightWrapper element');
        return null;
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
        const existingBadge = document.querySelector(`#voting-tool-badge-${proposal.postId}`);
        if (existingBadge) {
            console.log(`⚠️ Badge already exists for proposal #${proposal.postId}, skipping`);
            return;
        }

        // Create wrapper that will be positioned relative to the table row
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: absolute;
            left: -100px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10000;
            pointer-events: none;
        `;

        // Create container for the status badge
        const container = document.createElement('div');
        container.className = 'opengov-status-badge-floating';
        container.id = `voting-tool-badge-${proposal.postId}`;
        container.setAttribute('data-opengov-proposal', proposal.postId.toString());
        container.style.cssText = `
            pointer-events: auto;
        `;
        
        wrapper.appendChild(container);

        // Find the best parent for positioning (should be the table row itself or its direct parent)
        const positioningParent = this.findRowPositioningParent(proposal.headerElement);
        
        // Make the positioning parent relative if it's not already
        const parentStyle = window.getComputedStyle(positioningParent);
        if (parentStyle.position === 'static') {
            positioningParent.style.position = 'relative';
        }

        // Fix overflow issues that would clip the badge (look higher up the DOM tree)
        this.fixOverflowClipping(proposal.headerElement);

        // Insert the wrapper
        positioningParent.appendChild(wrapper);

        console.log('🎯 Positioning badge for proposal', proposal.postId, {
            targetElement: proposal.headerElement.tagName + '.' + proposal.headerElement.className,
            positioningParent: positioningParent.tagName + '.' + positioningParent.className,
            parentPosition: parentStyle.position,
            sameElement: proposal.headerElement === positioningParent
        });

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
     * Find the best parent element for positioning the badge (focused on row-level positioning)
     */
    private findRowPositioningParent(targetElement: HTMLElement): HTMLElement {
        // If the target element is an <a> wrapper, look for the <tr> inside it
        if (targetElement.tagName.toLowerCase() === 'a') {
            const tr = targetElement.querySelector('tr');
            if (tr) {
                console.log('🔗 Found TR inside A tag, using TR for positioning');
                return tr;
            }
        }
        
        // Start with the target element and work our way up
        let current: HTMLElement | null = targetElement;
        
        while (current && current !== document.body) {
            // If we find a table row, use it directly
            if (current.tagName.toLowerCase() === 'tr') {
                console.log('🔗 Found TR, using TR for positioning');
                return current;
            }
            
            current = current.parentElement;
        }
        
        // Fallback to the target element itself
        return targetElement;
    }

    /**
     * Find the best parent element for positioning the badge (legacy method)
     */
    private findPositioningParent(targetElement: HTMLElement): HTMLElement {
        // Start with the target element and work our way up
        let current: HTMLElement | null = targetElement;
        
        while (current && current !== document.body) {
            // If we find a table row, use its parent (likely tbody or table)
            if (current.tagName.toLowerCase() === 'tr') {
                return current.parentElement as HTMLElement || current;
            }
            
            // If we find a positioned element, use it
            const style = window.getComputedStyle(current);
            if (style.position !== 'static') {
                return current;
            }
            
            current = current.parentElement;
        }
        
        // Fallback to the target element itself
        return targetElement;
    }

    /**
     * Fix overflow clipping that would hide badges positioned outside the container
     */
    private fixOverflowClipping(positioningParent: HTMLElement): void {
        // Look for overflow containers that might clip our badge
        let current: HTMLElement | null = positioningParent;
        
        while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            
            // Check for containers with overflow that would clip left-positioned elements
            const hasClippingOverflow = 
                style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflowX === 'hidden' ||
                style.overflow === 'auto' || style.overflow === 'scroll' || style.overflow === 'hidden';
            
            if (hasClippingOverflow) {
                console.log('🔧 Found overflow container, adjusting:', {
                    element: current.tagName + '.' + current.className,
                    originalOverflow: { 
                        overflow: style.overflow, 
                        overflowX: style.overflowX, 
                        overflowY: style.overflowY 
                    }
                });
                
                // Store original values for cleanup
                if (!current.hasAttribute('data-opengov-original-overflow-x')) {
                    current.setAttribute('data-opengov-original-overflow-x', style.overflowX);
                    current.setAttribute('data-opengov-original-overflow', style.overflow);
                    current.setAttribute('data-opengov-original-overflow-y', style.overflowY);
                }
                
                // Apply comprehensive overflow fix with !important to override any CSS
                current.style.setProperty('overflow-x', 'visible', 'important');
                current.style.setProperty('overflow', 'visible', 'important');
                
                // Preserve overflow-y if it was specifically set to something useful
                if (style.overflowY === 'visible' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                    current.style.setProperty('overflow-y', style.overflowY, 'important');
                }
            }
            
            current = current.parentElement;
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
     * Handle proposal assignment events from components
     */
    private async handleProposalAssigned(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, action } = customEvent.detail;
        
        console.log('👤 Proposal assignment requested:', customEvent.detail);
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for assignment');
                return;
            }

            // TODO: Implement assignment API call
            console.log('Assignment would be processed for proposal', proposalId, 'on chain', currentProposal.chain);
            
            // For now, just show a success message
            console.log('✅ Proposal assigned successfully (placeholder)');
            
        } catch (error) {
            console.error('Failed to assign proposal:', error);
        }
    }

    /**
     * Handle vote change events from components
     */
    private async handleVoteChanged(event: Event): Promise<void> {
        const customEvent = event as CustomEvent;
        const { proposalId, vote, reason } = customEvent.detail;
        
        console.log('🗳️ Vote change requested:', customEvent.detail);
        
        try {
            // Get the current proposal to determine chain
            const currentProposal = this.detector.detectCurrentProposal();
            if (!currentProposal) {
                console.error('Could not determine current proposal for vote change');
                return;
            }

            // TODO: Implement vote change API call
            console.log('Vote change would be processed for proposal', proposalId, 'on chain', currentProposal.chain);
            console.log('Vote:', vote, 'Reason:', reason);
            
            // For now, just show a success message
            console.log('✅ Vote updated successfully (placeholder)');
            
        } catch (error) {
            console.error('Failed to update vote:', error);
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

        // Remove voting controls
        document.querySelectorAll('#voting-tool-controls, #voting-tool-controls-container').forEach(element => {
            element.remove();
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
        
        // Clean up event listeners and watchers
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        
        window.removeEventListener('statusChanged', this.handleStatusChange.bind(this) as EventListener);
        window.removeEventListener('proposalAssigned', this.handleProposalAssigned.bind(this) as EventListener);
        window.removeEventListener('voteChanged', this.handleVoteChanged.bind(this) as EventListener);
        
        // Clear caches
        this.proposalCache.clear();
        
        console.log('🧹 Content injector cleaned up');
    }
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}