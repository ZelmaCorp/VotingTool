// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

// Check if already initialized to prevent duplicates
if (window.opengovVotingToolInitialized) {
  console.log('🚫 OpenGov VotingTool already initialized, skipping...')
  throw new Error('Already initialized')
}

// Mark as initialized
window.opengovVotingToolInitialized = true

import { createApp } from 'vue'
import App from './App.vue'

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

// Create the extension container
const extensionContainer = document.createElement('div')
extensionContainer.id = 'opengov-voting-extension'
extensionContainer.style.position = 'fixed'
extensionContainer.style.top = '0'
extensionContainer.style.left = '0'
extensionContainer.style.width = '100%'
extensionContainer.style.height = '100%'
extensionContainer.style.pointerEvents = 'none'
extensionContainer.style.zIndex = '999999'

// Append to the page
document.body.appendChild(extensionContainer)

// Inject the inject.js script into the page context using the proper manifest-based approach
const script = document.createElement('script')
script.src = chrome.runtime.getURL('inject.js')
script.onload = () => {
  console.log('✅ Inject.js loaded successfully, removing script element')
  script.remove()
}
document.head.appendChild(script)

// Listen for messages from the page context
window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  
  console.log('📡 Extension context: received message:', event.data.type, event.data.data);
  
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
  console.log('🔍 Testing background script connection...');
  try {
    chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Background script connection failed:', chrome.runtime.lastError);
      } else {
        console.log('✅ Background script connection successful:', response);
      }
    });
  } catch (error) {
    console.error('❌ Error testing background script connection:', error);
  }
}, 500);

// Trigger initial check
setTimeout(() => {
  console.log('🔍 Extension context: triggering initial check...');
  window.postMessage({
    type: 'CHECK_WALLET_EXTENSION'
  }, '*');
}, 1000);

// Initialize the extension
createApp(App).mount('#opengov-voting-extension') 