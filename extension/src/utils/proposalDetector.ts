// Polkassembly Proposal Detection and Data Extraction

export interface DetectedProposal {
    postId: number;
    title: string;
    chain: 'Polkadot' | 'Kusama';
    url: string;
    titleElement?: HTMLElement;
    headerElement?: HTMLElement;
}

export class ProposalDetector {
    private static instance: ProposalDetector;
    
    static getInstance(): ProposalDetector {
        if (!ProposalDetector.instance) {
            ProposalDetector.instance = new ProposalDetector();
        }
        return ProposalDetector.instance;
    }

    /**
     * Detect if we're on a Polkassembly or Subsquare site
     */
    isSupportedSite(): boolean {
        const hostname = window.location.hostname;
        return hostname.includes('polkassembly.io') || hostname.includes('subsquare.io');
    }

    /**
     * Extract chain information from the URL
     */
    getChainFromUrl(): 'Polkadot' | 'Kusama' | null {
        const hostname = window.location.hostname;
        if (hostname.includes('polkadot.')) {
            return 'Polkadot';
        } else if (hostname.includes('kusama.')) {
            return 'Kusama';
        }
        return null;
    }

    /**
     * Check if we're on a proposal/referendum page
     */
    isProposalPage(): boolean {
        const path = window.location.pathname;
        // Match patterns like /referendum/123, /proposal/456, etc.
        return /\/(referendum|proposal|referenda)\/\d+/.test(path);
    }

    /**
     * Extract proposal ID from URL
     */
    getProposalIdFromUrl(): number | null {
        const path = window.location.pathname;
        const match = path.match(/\/(referendum|proposal|referenda)\/(\d+)/);
        return match ? parseInt(match[2], 10) : null;
    }

    /**
     * Find proposal title element on the page
     */
    findTitleElement(): HTMLElement | null {
        // Try multiple selectors for different page layouts
        const selectors = [
            'h1', // Main title
            '[data-testid="proposal-title"]',
            '.proposal-title',
            '.referendum-title',
            'h1.text-2xl', // Tailwind classes commonly used
            'h1.font-bold',
            '.text-xl.font-semibold'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element && element.textContent && element.textContent.trim()) {
                return element;
            }
        }

        return null;
    }

    /**
     * Find the best location to inject status badge
     */
    findStatusBadgeLocation(): HTMLElement | null {
        const titleElement = this.findTitleElement();
        if (!titleElement) return null;

        // Look for a container that wraps the title and metadata
        let container = titleElement.parentElement;
        while (container && container !== document.body) {
            // Check if this container looks like a proposal header
            const hasMetadata = container.querySelector('[class*="meta"]') || 
                               container.querySelector('[class*="info"]') ||
                               container.querySelector('.text-sm') ||
                               container.querySelector('.text-gray');
            
            if (hasMetadata) {
                return container;
            }
            container = container.parentElement;
        }

        // Fallback to title's parent
        return titleElement.parentElement;
    }

    /**
     * Extract proposal title from the page
     */
    extractProposalTitle(): string {
        const titleElement = this.findTitleElement();
        if (!titleElement) return 'Unknown Proposal';

        let title = titleElement.textContent?.trim() || 'Unknown Proposal';
        
        // Clean up common prefixes
        title = title.replace(/^(Referendum|Proposal)\s*#?\d+\s*:?\s*/i, '');
        title = title.replace(/^#\d+\s*:?\s*/, '');
        
        return title;
    }

    /**
     * Detect current proposal on the page
     */
    detectCurrentProposal(): DetectedProposal | null {
        if (!this.isSupportedSite() || !this.isProposalPage()) {
            return null;
        }

        const postId = this.getProposalIdFromUrl();
        const chain = this.getChainFromUrl();
        const title = this.extractProposalTitle();
        const titleElement = this.findTitleElement();
        const headerElement = this.findStatusBadgeLocation();

        if (!postId || !chain) {
            return null;
        }

        return {
            postId,
            title,
            chain,
            url: window.location.href,
            titleElement: titleElement || undefined,
            headerElement: headerElement || undefined
        };
    }

    /**
     * Detect all proposals on a list page
     */
    detectProposalsOnListPage(): DetectedProposal[] {
        if (!this.isSupportedSite()) {
            return [];
        }

        const proposals: DetectedProposal[] = [];
        const chain = this.getChainFromUrl();
        if (!chain) return proposals;

        // Look for proposal cards/items in lists
        const proposalSelectors = [
            'a[href*="/referendum/"]',
            'a[href*="/proposal/"]',
            'a[href*="/referenda/"]',
            '[class*="proposal-card"]',
            '[class*="referendum-card"]'
        ];

        for (const selector of proposalSelectors) {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach((element) => {
                const link = element.getAttribute('href') || element.querySelector('a')?.getAttribute('href');
                if (!link) return;

                const match = link.match(/\/(referendum|proposal|referenda)\/(\d+)/);
                if (!match) return;

                const postId = parseInt(match[2], 10);
                const titleElement = element.querySelector('h1, h2, h3, .title, [class*="title"]') as HTMLElement;
                const title = titleElement?.textContent?.trim() || `${match[1]} #${postId}`;

                proposals.push({
                    postId,
                    title,
                    chain,
                    url: link.startsWith('http') ? link : `${window.location.origin}${link}`,
                    titleElement,
                    headerElement: element as HTMLElement
                });
            });
        }

        return proposals;
    }

    /**
     * Watch for page changes (SPA navigation)
     */
    watchForChanges(callback: (proposal: DetectedProposal | null) => void): () => void {
        let currentUrl = window.location.href;
        
        const checkForChanges = () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                // Wait a bit for the page to render
                setTimeout(() => {
                    const proposal = this.detectCurrentProposal();
                    callback(proposal);
                }, 500);
            }
        };

        // Listen for both popstate and pushstate/replacestate
        window.addEventListener('popstate', checkForChanges);
        
        // Override pushState and replaceState to catch programmatic navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(checkForChanges, 100);
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(checkForChanges, 100);
        };

        // Also watch for DOM changes
        const observer = new MutationObserver(() => {
            checkForChanges();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Return cleanup function
        return () => {
            window.removeEventListener('popstate', checkForChanges);
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            observer.disconnect();
        };
    }
} 