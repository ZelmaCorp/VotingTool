// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

import { createApp } from 'vue'
import App from './App.vue'

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
      signatureResult?: any;
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

// Inject a script into the page context to detect wallet extensions
const script = document.createElement('script')
script.textContent = `
  // This runs in the page context, not the extension context
  let enabledExtension = null;
  
  window.opengovVotingTool = {
    // Check if wallet extensions are available
    checkWalletExtension: function() {
      console.log('🔍 Page context: checking for wallet extensions...');
      const hasPolkadot = !!(window.injectedWeb3 && window.injectedWeb3['polkadot-js']);
      console.log('🔍 Page context: hasPolkadotExtension =', hasPolkadot);
      
      return {
        hasPolkadotExtension: hasPolkadot,
        timestamp: Date.now()
      };
    },
    
    // Complete wallet connection flow
    connectWallet: async function() {
      try {
        console.log('🔗 Page context: starting wallet connection...');
        
        if (!window.injectedWeb3?.['polkadot-js']) {
          throw new Error('Polkadot Extension not available');
        }
        
        // Step 1: Enable the extension
        console.log('🔗 Page context: enabling Polkadot Extension...');
        enabledExtension = await window.injectedWeb3['polkadot-js'].enable();
        console.log('✅ Page context: Polkadot Extension enabled');
        
        // Step 2: Get accounts
        console.log('📋 Page context: getting accounts...');
        const walletAccounts = await enabledExtension.accounts.get();
        console.log('📋 Page context: got', walletAccounts.length, 'accounts');
        
        if (walletAccounts.length === 0) {
          throw new Error('No accounts found in Polkadot Extension');
        }
        
        // Transform accounts to simple objects (no functions)
        const accounts = walletAccounts.map(acc => ({
          address: acc.address,
          name: acc.name || 'Unnamed Account'
        }));
        
        return {
          success: true,
          accounts: accounts,
          message: 'Wallet connected successfully'
        };
        
      } catch (error) {
        console.error('❌ Page context: Wallet connection failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    
    // Sign a message
    signMessage: async function(address, message) {
      try {
        console.log('✍️ Page context: signing message for address:', address);
        
        if (!enabledExtension) {
          throw new Error('Extension not enabled. Connect wallet first.');
        }
        
        const { signature } = await enabledExtension.signer.signRaw({
          address: address,
          data: message,
          type: 'bytes'
        });
        
        console.log('✅ Page context: message signed successfully');
        return {
          success: true,
          signature: signature,
          message: 'Message signed successfully'
        };
        
      } catch (error) {
        console.error('❌ Page context: Failed to sign message:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  };
  
  // Listen for messages from the extension context
  window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    
    console.log('📡 Page context: received message:', event.data.type);
    
    if (event.data.type === 'CHECK_WALLET_EXTENSION') {
      const result = window.opengovVotingTool.checkWalletExtension();
      window.postMessage({
        type: 'WALLET_EXTENSION_RESULT',
        data: result
      }, '*');
    }
    
    if (event.data.type === 'CONNECT_WALLET') {
      window.opengovVotingTool.connectWallet().then(result => {
        window.postMessage({
          type: 'WALLET_CONNECTION_RESULT',
          data: result
        }, '*');
      });
    }
    
    if (event.data.type === 'SIGN_MESSAGE') {
      const { address, message } = event.data;
      window.opengovVotingTool.signMessage(address, message).then(result => {
        window.postMessage({
          type: 'SIGNATURE_RESULT',
          data: result
        }, '*');
      });
    }
  });
  
  // Initial check and notification
  console.log('🚀 Page context script loaded');
  const initialResult = window.opengovVotingTool.checkWalletExtension();
  if (initialResult.hasPolkadotExtension) {
    console.log('🎉 Page context: Initial check found Polkadot Extension!');
    window.postMessage({
      type: 'WALLET_EXTENSION_DETECTED',
      data: initialResult
    }, '*');
  }
`
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

// Trigger initial check
setTimeout(() => {
  console.log('🔍 Extension context: triggering initial check...');
  window.postMessage({
    type: 'CHECK_WALLET_EXTENSION'
  }, '*');
}, 1000);

// Initialize the extension
createApp(App).mount('#opengov-voting-extension') 