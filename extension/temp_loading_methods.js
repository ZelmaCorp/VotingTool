    /**
     * Check if the page is still loading proposals
     */
    isPageLoading(): boolean {
        // Look for the loading animation
        const loadingElement = document.querySelector('.lucide-loader-circle.animate-spin, .animate-spin');
        if (loadingElement) {
            console.log('�� Page is still loading - found loading spinner');
            return true;
        }

        // Also check for loading backdrop
        const loadingBackdrop = document.querySelector('.backdrop-blur-sm');
        if (loadingBackdrop && loadingBackdrop.textContent?.includes('loading')) {
            console.log('🔄 Page is still loading - found loading backdrop');
            return true;
        }

        // Check for any loading indicators
        const loadingIndicators = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="loader"]');
        for (const indicator of loadingIndicators) {
            if (indicator.textContent?.toLowerCase().includes('loading') || 
                indicator.classList.contains('animate-spin')) {
                console.log('🔄 Page is still loading - found loading indicator');
                return true;
            }
        }

        return false;
    }

    /**
     * Wait for page to finish loading
     */
    async waitForPageToLoad(maxWaitTime: number = 10000): Promise<boolean> {
        const startTime = Date.now();
        
        while (this.isPageLoading() && (Date.now() - startTime) < maxWaitTime) {
            console.log('⏳ Waiting for page to finish loading...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const stillLoading = this.isPageLoading();
        if (stillLoading) {
            console.log('⚠️ Page still loading after timeout, proceeding anyway');
        } else {
            console.log('✅ Page finished loading');
        }
        
        return !stillLoading;
    }
