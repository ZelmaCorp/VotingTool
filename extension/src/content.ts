// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension
//
// KNOWN ISSUE: On F5 page reload, the extension may occasionally not initialize properly.
// This appears to be a timing issue with how Chrome/Firefox handle content script injection
// during hard refreshes. Workaround: Reload the page again or reload the extension.
// The duplicate prevention logic below helps prevent multiple injections, but may
// occasionally be too aggressive and prevent initialization on reload.

import { createApp } from 'vue'
import App from './App.vue'
import { ContentInjector } from './utils/contentInjector'
import { proposalStore, teamStore } from './stores'
import '../design-system.css'

// Check if already initialized - check both flag and DOM element
const existingContainer = document.getElementById('opengov-voting-extension')
const ALREADY_INITIALIZED = window.opengovVotingToolInitialized === true || existingContainer !== null

if (ALREADY_INITIALIZED) {
  console.log('ℹ️ OpenGov VotingTool already initialized, skipping duplicate injection')
  // Stop execution completely
  throw new Error('Already initialized')
}

// Mark as initialized immediately
window.opengovVotingToolInitialized = true

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