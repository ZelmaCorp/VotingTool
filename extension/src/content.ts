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
    const app = createApp(App);
    app.mount('#opengov-voting-extension');
    
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

// Simple, robust initialization - wait for DOM then initialize
function init() {
  if (document.body) {
    initializeExtension()
  } else {
    // DOM not ready, wait for it
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeExtension)
    } else {
      // Try again soon
      setTimeout(init, 100)
    }
  }
}

// Start initialization
init()

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (contentInjector) {
    contentInjector.cleanup();
  }
}); 