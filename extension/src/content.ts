// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

// Check if already initialized to prevent duplicates
if (window.opengovVotingToolInitialized) {
  throw new Error('Already initialized')
}

// Mark as initialized
window.opengovVotingToolInitialized = true

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { ContentInjector } from './utils/contentInjector'

// Extend Window interface
declare global {
  interface Window {
    opengovVotingToolInitialized?: boolean;
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

// Initialize content injector
let contentInjector: ContentInjector | null = null;

async function initializeExtension() {
  try {
    console.log('🚀 OpenGov VotingTool Extension - Starting initialization');
    
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

    // Initialize Vue app with Pinia
    const app = createApp(App);
    const pinia = createPinia();
    app.use(pinia);
    app.mount('#opengov-voting-extension');
    console.log('✅ Mounted floating hamburger menu with Pinia store');
    
    // Initialize content injector for status badges
    contentInjector = ContentInjector.getInstance();
    await contentInjector.initialize();
    
    console.log('✅ OpenGov VotingTool Extension - Initialization complete');
  } catch (error) {
    console.error('❌ OpenGov VotingTool Extension - Initialization failed:', error);
  }
}

// Inject the inject.js script into the page context using the proper manifest-based approach
const script = document.createElement('script')
script.src = chrome.runtime.getURL('inject.js')
script.onload = () => {
  script.remove()
}
document.head.appendChild(script)

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

// Test background script connection
setTimeout(() => {
  try {
    chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Background script connection failed:', chrome.runtime.lastError);
      }
    });
  } catch (error) {
    console.error('❌ Error testing background script connection:', error);
  }
}, 500);

// Trigger initial check
setTimeout(() => {
  window.postMessage({
    type: 'CHECK_WALLET_EXTENSION'
  }, '*');
}, 1000);

// Multiple initialization strategies to handle different loading scenarios
function ensureInitialization() {
  console.log('🔄 Ensuring extension initialization...');
  
  // Strategy 1: If DOM is already loaded, initialize immediately
  if (document.readyState === 'complete') {
    console.log('✅ DOM already complete, initializing immediately');
    initializeExtension();
    return;
  }
  
  // Strategy 2: Wait for DOM to be ready
  if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('✅ DOMContentLoaded fired, initializing...');
      setTimeout(initializeExtension, 500); // Small delay after DOM ready
    });
  } else {
    console.log('✅ DOM interactive, initializing with delay...');
    setTimeout(initializeExtension, 500);
  }
  
  // Strategy 3: Fallback with window.onload
  window.addEventListener('load', () => {
    console.log('✅ Window load event fired, ensuring initialization...');
    setTimeout(() => {
      if (!contentInjector) {
        console.log('🔄 No content injector found, initializing as fallback...');
        initializeExtension();
      } else {
        console.log('✅ Content injector already exists, skipping duplicate initialization...');
        // Don't call initialize() again as it can cause unnecessary cleanup/re-injection
      }
    }, 1000);
  });
  
  // Strategy 4: Additional fallback after fixed delay
  setTimeout(() => {
    if (!contentInjector) {
      console.log('🔄 Final fallback initialization...');
      initializeExtension();
    }
  }, 3000);
}

// Start the initialization process
ensureInitialization();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (contentInjector) {
    contentInjector.cleanup();
  }
}); 