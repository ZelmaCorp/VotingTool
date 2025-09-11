// Tab Detection for Polkassembly Category Filtering
// Detects which origin/category tab is active and determines if voting tool should show badges

export interface ActiveTabInfo {
    activeCategory: string | null;
    shouldShowBadges: boolean;
    isTrackedOrigin: boolean;
}

export class TabDetector {
    private static instance: TabDetector;
    
    // Map polkassembly categories to our Origin enum values
    private readonly POLKASSEMBLY_TO_ORIGIN_MAP: Record<string, string> = {
        'Root': 'Root',
        'WishForChange': 'Wish For Change', 
        'BigSpender': 'Big Spender',
        'MediumSpender': 'Medium Spender',
        'SmallSpender': 'Small Spender',
        'BigTipper': 'Big Tipper',
        'SmallTipper': 'Small Tipper',
        'Treasurer': 'Treasurer',
        'WhitelistedCaller': 'Whitelisted Caller',
        'ReferendumCanceller': 'Referendum Canceller',
        'ReferendumKiller': 'Referendum Killer',
    };

    // Categories from polkassembly that we don't track (so no badges should show)
    private readonly UNTRACKED_CATEGORIES = ['Discussion', 'Staking Admin', 'Lease Admin', 'Fellowship Admin', 'General Admin', 'Auction Admin'];

    static getInstance(): TabDetector {
        if (!TabDetector.instance) {
            TabDetector.instance = new TabDetector();
        }
        return TabDetector.instance;
    }

    /**
     * Detect which tab is currently active on polkassembly
     */
    detectActiveTab(): ActiveTabInfo {
        console.log('🔍 TabDetector: Detecting active tab...');
        
        // Look for active tab button with data-state="active" or aria-selected="true"
        const activeButton = document.querySelector('button[data-state="active"][role="tab"], button[aria-selected="true"][role="tab"]') as HTMLButtonElement;
        
        console.log('🔍 TabDetector: Found active button:', activeButton);
        
        if (!activeButton) {
            return {
                activeCategory: null,
                shouldShowBadges: false,
                isTrackedOrigin: false
            };
        }

        // Extract category from button
        const category = this.extractCategoryFromButton(activeButton);
        console.log('🔍 TabDetector: Extracted category:', category);
        
        if (!category) {
            return {
                activeCategory: null,
                shouldShowBadges: false,
                isTrackedOrigin: false
            };
        }

        // Check if this category is tracked in our Origin enum
        const isTrackedOrigin = this.isCategoryTracked(category);
        console.log('🔍 TabDetector: Is tracked origin:', isTrackedOrigin);
        
        const result = {
            activeCategory: category,
            shouldShowBadges: isTrackedOrigin,
            isTrackedOrigin
        };
        
        console.log('🔍 TabDetector: Final result:', result);
        return result;
    }

    /**
     * Extract category name from the active button
     */
    private extractCategoryFromButton(button: HTMLButtonElement): string | null {
        // Try data-value attribute first (most reliable)
        let category = button.getAttribute('data-value');
        
        if (!category) {
            // Try id attribute (like "radix-r10-trigger-Root")
            const id = button.id;
            if (id) {
                const match = id.match(/trigger-(.+)$/);
                if (match) {
                    category = match[1];
                }
            }
        }
        
        if (!category) {
            // Fallback to button text content
            category = button.textContent?.trim() || null;
        }

        // Handle space-separated category names
        if (category) {
            category = category.replace(/ /g, '');
        }

        console.log('🔍 TabDetector: Extracted category:', category);
        return category;
    }

    /**
     * Check if a category is tracked in our Origin enum
     */
    private isCategoryTracked(category: string): boolean {
        // Check if it's explicitly untracked
        if (this.UNTRACKED_CATEGORIES.includes(category)) {
            return false;
        }

        // Check if it's in our mapping (this covers all tracked origins)
        return this.POLKASSEMBLY_TO_ORIGIN_MAP.hasOwnProperty(category) || category.includes('all');
    }

    /**
     * Get the mapped Origin enum value for a polkassembly category
     */
    getOriginForCategory(category: string): string | null {
        if (category.includes('All')) {
            return 'All';
        }
        return this.POLKASSEMBLY_TO_ORIGIN_MAP[category] || null;
    }

    /**
     * Watch for tab changes and call callback when active tab changes
     */
    watchForTabChanges(callback: (tabInfo: ActiveTabInfo) => void): () => void {
        let currentActiveTab = this.detectActiveTab();
        
        const checkForTabChanges = () => {
            const newActiveTab = this.detectActiveTab();
            
            // Check if the active tab has changed
            if (newActiveTab.activeCategory !== currentActiveTab.activeCategory) {
                console.log('🔄 Tab changed from', currentActiveTab.activeCategory, 'to', newActiveTab.activeCategory);
                currentActiveTab = newActiveTab;
                callback(newActiveTab);
            }
        };

        // Listen for clicks on tab buttons
        const handleTabClick = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('button[role="tab"]')) {
                // Wait a bit for the tab to become active
                setTimeout(checkForTabChanges, 100);
            }
        };

        // Listen for DOM mutations that might indicate tab changes
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const target = mutation.target as HTMLElement;
                    if (target.matches('button[role="tab"]') && 
                        (mutation.attributeName === 'data-state' || 
                         mutation.attributeName === 'aria-selected')) {
                        shouldCheck = true;
                    }
                }
            });
            
            if (shouldCheck) {
                setTimeout(checkForTabChanges, 50);
            }
        });

        // Start observing
        document.addEventListener('click', handleTabClick);
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['data-state', 'aria-selected']
        });

        // Return cleanup function
        return () => {
            document.removeEventListener('click', handleTabClick);
            observer.disconnect();
        };
    }

    /**
     * Check if we're on a page that has category tabs
     */
    isOnCategoryPage(): boolean {
        // Look for tab buttons that suggest we're on a categorized page
        const tabButtons = document.querySelectorAll('button[role="tab"]');
        return tabButtons.length > 0;
    }
} 