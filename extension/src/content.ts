// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

import { createApp } from 'vue'
import App from './App.vue'
import { ContentInjector } from './utils/contentInjector'
import { proposalStore, teamStore } from './stores'
import '../design-system.css'

// Extend Window interface
declare global {
  interface Window {
    opengovVotingToolResult?: {
      hasPolkadotExtension?: boolean;
      injectedWeb3?: any;
      enabledExtension?: any;
      accounts?: any[];
      lastSignature?: string;
      connectionResult?: any;
      signatureResult?: {
        success: boolean;
        signature?: string;
        error?: string;
        message?: string;
      };
      availableWallets?: Array<{
        name: string;
        key: string;
      }>;
    };
  }
}

// Smart duplicate prevention - only trust the DOM, not flags
// Check if container already exists in DOM
const existingContainer = document.getElementById('opengov-voting-extension')

if (existingContainer) {
  console.log('⚠️ OpenGov VotingTool: Found existing container, cleaning up for reinitialization...')
  
  // Clean up the old container
  try {
    existingContainer.remove()
    console.log('✅ Old container removed, will reinitialize')
  } catch (error) {
    console.warn('⚠️ Failed to remove old container:', error)
  }
}

// Always proceed with initialization - DOM is source of truth
// Don't rely on window flags as they can have stale/incorrect state
console.log('🚀 OpenGov VotingTool: Starting initialization...')

// Initialize content injector
let contentInjector: ContentInjector | null = null;
let vueApp: any = null;
let removalObserver: MutationObserver | null = null;
let reinjectionTimeout: number | null = null;
let removalCount = 0;
let lastRemovalTime = 0;

/**
 * Re-inject the main container
 */
async function reinjectContainer() {
  // Clear any pending re-injection
  if (reinjectionTimeout) {
    clearTimeout(reinjectionTimeout);
    reinjectionTimeout = null;
  }
  
  const existing = document.getElementById('opengov-voting-extension');
  if (existing) {
    console.log('ℹ️ Container already exists, skipping re-injection');
    return;
  }
  
  try {
    console.log('🔄 Re-injecting extension container...');
    
    const extensionContainer = document.createElement('div');
    extensionContainer.id = 'opengov-voting-extension';
    extensionContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;
    
    // Append to body - this will trigger our observer again, but that's ok
    document.body.appendChild(extensionContainer);
    
    // ALWAYS create a fresh Vue app instance - can't re-mount a removed app
    try {
      console.log('🔧 Creating fresh Vue app instance...');
      const { createApp } = await import('vue');
      const App = (await import('./App.vue')).default;
      
      // Create new instance
      vueApp = createApp(App);
      
      // Mount to container
      vueApp.mount('#opengov-voting-extension');
      console.log('✅ Fresh Vue app created and mounted');
      
      // Verify it rendered
      const menuButton = document.querySelector('.floating-button');
      if (menuButton) {
        console.log('✅ Menu button found in DOM - rendering successful!');
      } else {
        console.error('❌ Menu button NOT found in DOM after mounting!');
      }
    } catch (mountError) {
      console.error('❌ Failed to create/mount Vue app:', mountError);
      console.error('Error details:', mountError);
    }
  } catch (error) {
    console.error('❌ Error re-injecting container:', error);
  }
}

/**
 * Protect main container from removal by page's DOM manipulations
 */
function setupContainerProtection() {
  removalObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Check if our container was removed
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        mutation.removedNodes.forEach((node) => {
          if (node instanceof Element && node.id === 'opengov-voting-extension') {
            const now = Date.now();
            
            // Track removal frequency
            if (now - lastRemovalTime < 1000) {
              removalCount++;
            } else {
              removalCount = 1;
            }
            lastRemovalTime = now;
            
            console.warn(`⚠️ Main extension container was removed! (${removalCount} times in last second)`);
            
            // Use longer delays to let page finish its initialization
            // First removal: wait 1 second for page to settle
            // Multiple removals: wait even longer
            const delay = removalCount > 3 ? 3000 : removalCount > 1 ? 2000 : 1000;
            console.log(`⏱️ Scheduling re-injection with ${delay}ms delay...`);
            
            // Debounce re-injection
            if (reinjectionTimeout) {
              clearTimeout(reinjectionTimeout);
              console.log('🔄 Cancelled previous scheduled re-injection');
            }
            
            reinjectionTimeout = window.setTimeout(() => {
              console.log('⏰ Re-injection timeout fired, calling reinjectContainer()...');
              reinjectContainer().then(() => {
                console.log('✅ reinjectContainer() completed');
              }).catch(error => {
                console.error('❌ reinjectContainer() failed:', error);
              });
            }, delay);
            
            console.log(`✅ Re-injection scheduled (timeout ID: ${reinjectionTimeout})`);
          }
        });
      }
    }
  });
  
  // Watch the body for removal of our container
  removalObserver.observe(document.body, {
    childList: true,
    subtree: false // Only direct children of body
  });
  
  // Also set up a continuous monitor that checks every 3 seconds
  // This catches cases where setTimeout might have failed or been cleared
  setInterval(() => {
    const container = document.getElementById('opengov-voting-extension');
    if (!container) {
      console.warn('🔍 Periodic check: Container missing! Forcing re-injection...');
      reinjectContainer().catch(error => {
        console.error('❌ Periodic re-injection failed:', error);
      });
    }
  }, 3000);
  
  console.log('🛡️ Container protection activated with adaptive debouncing + periodic monitoring');
}

async function initializeExtension() {
  try {
    console.log('🚀 OpenGov VotingTool - Initializing...')
    
    // Create container for our floating hamburger menu
    const extensionContainer = document.createElement('div');
    extensionContainer.id = 'opengov-voting-extension';
    extensionContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
    `;
    document.body.appendChild(extensionContainer);

    // Initialize Vue app
    vueApp = createApp(App);
    vueApp.mount('#opengov-voting-extension');
    
    // Set up protection against removal
    setupContainerProtection();
    
    // Initialize content injector for status badges
    contentInjector = ContentInjector.getInstance();
    await contentInjector.initialize();
    
    // Initialize stores if authenticated
    await proposalStore.initialize();
    await teamStore.initialize();
    
    console.log('✅ OpenGov VotingTool - Initialized successfully')
  } catch (error) {
    console.error('❌ OpenGov VotingTool - Initialization failed:', error);
  }
}

// Inject the inject.js script into the page context
const script = document.createElement('script')
script.src = chrome.runtime.getURL('inject.js')
script.onload = () => {
  script.remove()
}
;(document.head || document.documentElement).appendChild(script)

// Listen for messages from the page context
window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  
  if (event.data.type === 'WALLET_EXTENSION_RESULT') {
    window.opengovVotingToolResult = event.data.data;
  }
  
  if (event.data.type === 'WALLET_EXTENSION_DETECTED') {
    window.opengovVotingToolResult = event.data.data;
  }
  
  if (event.data.type === 'WALLET_CONNECTION_RESULT') {
    window.opengovVotingToolResult = {
      ...window.opengovVotingToolResult,
      connectionResult: event.data.data
    };
  }
  
  if (event.data.type === 'SIGNATURE_RESULT') {
    window.opengovVotingToolResult = {
      ...window.opengovVotingToolResult,
      signatureResult: event.data.data
    };
  }
});

// Simple initialization - one clear path
if (document.readyState === 'loading') {
  // DOM not ready, wait for it
  document.addEventListener('DOMContentLoaded', initializeExtension)
} else {
  // DOM already ready, initialize immediately
  initializeExtension()
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (contentInjector) {
    contentInjector.cleanup();
  }
}); 