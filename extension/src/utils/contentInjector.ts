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
    private isInjecting: boolean = false;

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

        // Mutation observer removed - it was causing re-injection loops and blinking
        // The multiple initialization strategies (DOMContentLoaded, window.onload, retries) 
        // are sufficient for handling F5 refreshes and page loading scenarios
        console.log('ℹ️ Using initialization strategies without mutation observer to prevent blinking');

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
        
        // Check if this is a referenda detail page (matches pattern like /referenda/123)
        const referendaDetailPattern = /\/referenda\/\d+/;
        if (referendaDetailPattern.test(window.location.pathname)) {
            console.log('📋 Detected referenda detail page, injecting voting controls');
            console.log('🔍 URL:', window.location.pathname);
            console.log('✅ Referenda detail pages always show voting controls, ignoring tab restrictions');
            
            // Add a small delay to ensure the page is fully rendered
            await sleep(500);
            
            await this.injectVotingControls(proposal, proposalData);
        } else {
            // For other proposal pages (list pages), check tab restrictions
            if (this.tabDetector.isOnCategoryPage()) {
                const currentTab = this.currentActiveTab || this.tabDetector.detectActiveTab();
                if (!currentTab.shouldShowBadges) {
                    console.log(`⏸️ Not showing badge for list page - active tab "${currentTab.activeCategory}" is not tracked`);
                    return;
                }
            }
            
            // Inject status badge for list pages
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
        try {
            console.log('🎯 Injecting voting controls for proposal', proposal.postId);
            console.log('🔍 Current URL:', window.location.href);

            // Prevent multiple simultaneous injections
            if (this.isInjecting) {
                console.log('⚠️ Already injecting voting controls, skipping to prevent race condition');
                return;
            }

            // Check if already injected for this specific proposal
            const existingControls = document.querySelector('#voting-tool-controls') || 
                                    document.querySelector('#voting-tool-controls-container') ||
                                    document.querySelector(`[data-opengov-proposal="${proposal.postId}"]`);
            if (existingControls) {
                console.log('⚠️ Voting controls already exist for proposal', proposal.postId, ', skipping');
                return;
            }

            this.isInjecting = true;

        // Since we're on a referenda page, the element MUST exist - retry aggressively
        let rightWrapper: HTMLElement | null = null;
        let retryCount = 0;
        const maxRetries = 10; // Increased to 10 retries
        
        console.log('🔄 Starting aggressive retry mechanism for referenda page...');
        
        while (!rightWrapper && retryCount < maxRetries) {
            retryCount++;
            console.log(`🔄 Attempt ${retryCount}/${maxRetries} to find PostDetails_rightWrapper...`);
            
            if (retryCount > 1) {
                await sleep(1000); // Wait 1 second before retry (except first attempt)
            }
            
            rightWrapper = this.findPostDetailsRightWrapper();
            
            if (rightWrapper) {
                console.log(`✅ Found element on attempt ${retryCount}!`);
                break;
            } else {
                console.log(`❌ Attempt ${retryCount} failed, element not found`);
                
                // Log page state for debugging
                console.log(`📊 Page state: readyState=${document.readyState}, title="${document.title}"`);
                console.log(`📊 Body children count: ${document.body.children.length}`);
                
                // On every 3rd attempt, try a more thorough search
                if (retryCount % 3 === 0) {
                    console.log('🔍 Performing thorough DOM search...');
                    const allElements = document.querySelectorAll('*');
                    console.log(`📊 Total elements on page: ${allElements.length}`);
                    
                    // Look for any element that might be our target
                    const potentialTargets = document.querySelectorAll('div, section, main, article');
                    console.log(`📊 Potential target elements: ${potentialTargets.length}`);
                    
                    // Log first few potential targets
                    for (let i = 0; i < Math.min(10, potentialTargets.length); i++) {
                        const el = potentialTargets[i] as HTMLElement;
                        console.log(`  Target ${i}: ${el.tagName}.${el.className} (${el.offsetWidth}x${el.offsetHeight})`);
                    }
                }
            }
        }

        // If still not found after all retries, this is a critical issue
        if (!rightWrapper) {
            console.error('💥 CRITICAL: PostDetails_rightWrapper not found after 10 retries on referenda page!');
            console.error('💥 This should never happen on a valid referenda page');
            console.error('💥 URL:', window.location.href);
            console.error('💥 Page title:', document.title);
            console.error('💥 Body HTML preview:', document.body.innerHTML.substring(0, 500));
            
            // Last resort: create fallback container but log it as an error
            console.log('🆘 Creating emergency fallback container...');
            rightWrapper = document.createElement('div');
            rightWrapper.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1000000;
                max-width: 400px;
                background: rgba(255, 0, 0, 0.9);
                color: white;
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 2px solid red;
            `;
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.innerHTML = `
                <strong>⚠️ FALLBACK MODE</strong><br>
                Could not find page element.<br>
                Please report this issue.
            `;
            rightWrapper.appendChild(errorMsg);
            
            document.body.appendChild(rightWrapper);
            console.log('🆘 Emergency fallback container created');
        }

        console.log('✅ Using wrapper element:', rightWrapper.className || 'fallback-container');

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
            isAuthenticated: this.apiService.isAuthenticated(),
            suggestedVote: proposalData?.suggested_vote || null
        });

        app.mount(container);

        // Store the app instance for cleanup
        this.injectedComponents.set(proposal.postId, app);

        console.log('✅ Injected voting controls for proposal', proposal.postId);
        
        } catch (error) {
            console.error('❌ Error injecting voting controls:', error);
        } finally {
            this.isInjecting = false;
        }
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
        
        // Clean up event listeners and watchers
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        
        // Clear injection flag
        this.isInjecting = false;
        
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