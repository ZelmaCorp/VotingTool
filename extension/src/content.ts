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

// Inject a script into the page context to detect wallet extensions
const script = document.createElement('script')
script.textContent = `
  // This runs in the page context, not the extension context
  let enabledExtension = null;
  
  window.opengovVotingTool = {
    // Check if wallet extensions are available
    checkWalletExtension: function() {
      console.log('🔍 Page context: checking for wallet extensions...');
      
      const availableWallets = [];
      
      // Check Polkadot Extension
      if (window.injectedWeb3?.['polkadot-js']) {
        availableWallets.push({
          name: 'Polkadot Extension',
          key: 'polkadot-js'
          // Don't include the extension object (has functions)
        });
      }
      
      // Check Talisman
      if (window.injectedWeb3?.talisman) {
        availableWallets.push({
          name: 'Talisman',
          key: 'talisman'
          // Don't include the extension object (has functions)
        });
      }
      
      console.log('🔍 Page context: available wallets =', availableWallets);
      
      return {
        hasPolkadotExtension: availableWallets.length > 0,
        availableWallets: availableWallets,
        timestamp: Date.now()
      };
    },
    
    // Get accounts from a specific wallet
    getWalletAccounts: async function(walletKey) {
      try {
        console.log('📋 Page context: getting accounts from wallet:', walletKey);
        
        if (!window.injectedWeb3?.[walletKey]) {
          throw new Error(\`Wallet \${walletKey} not available\`);
        }
        
        // Enable the wallet
        console.log('🔗 Page context: enabling wallet:', walletKey);
        const enabledWallet = await window.injectedWeb3[walletKey].enable();
        console.log('✅ Page context: wallet enabled:', enabledWallet);
        
        // Get accounts
        console.log('📋 Page context: getting accounts...');
        const walletAccounts = await enabledWallet.accounts.get();
        console.log('📋 Page context: raw wallet accounts =', walletAccounts);
        console.log('📋 Page context: got', walletAccounts.length, 'accounts');
        
        if (walletAccounts.length === 0) {
          throw new Error(\`No accounts found in \${walletKey}\`);
        }
        
        // Transform accounts to simple objects
        const accounts = walletAccounts.map(acc => ({
          address: acc.address,
          name: acc.name || 'Unnamed Account',
          wallet: walletKey
        }));
        
        console.log('📋 Page context: transformed accounts =', accounts);
        
        return {
          success: true,
          accounts: accounts,
          wallet: walletKey,
          message: \`Connected to \${walletKey} successfully\`
        };
        
      } catch (error) {
        console.error(\`❌ Page context: Failed to get accounts from \${walletKey}:\`, error);
        return {
          success: false,
          error: error.message,
          wallet: walletKey
        };
      }
    },
    
    // Sign a message
    signMessage: async function(address, message) {
      try {
        console.log('✍️ Page context: signing message for address:', address);
        
        // We need to re-enable the wallet for signing since we don't store the enabled state
        // Let's try both wallets to see which one has this address
        const wallets = ['polkadot-js', 'talisman'];
        
        for (const walletKey of wallets) {
          try {
            console.log('🔗 Page context: trying to enable wallet for signing:', walletKey);
            
            if (!window.injectedWeb3?.[walletKey]) {
              continue; // Try next wallet
            }
            
            // Enable the wallet
            const enabledWallet = await window.injectedWeb3[walletKey].enable();
            console.log('✅ Page context: wallet enabled for signing:', walletKey);
            
            // Get accounts to check if this address belongs to this wallet
            const accounts = await enabledWallet.accounts.get();
            const hasAddress = accounts.some(acc => acc.address === address);
            
            if (hasAddress) {
              console.log('✅ Page context: found address in wallet:', walletKey);
              
              // Sign the message
              const { signature } = await enabledWallet.signer.signRaw({
                address: address,
                data: message,
                type: 'bytes'
              });
              
              console.log('✅ Page context: message signed successfully');
              return {
                success: true,
                signature: signature,
                message: 'Message signed successfully',
                wallet: walletKey
              };
            }
          } catch (walletError) {
            console.log('⚠️ Page context: failed to use wallet:', walletKey, walletError);
            continue; // Try next wallet
          }
        }
        
        throw new Error('Could not find or enable wallet for this address');
        
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
      const { walletKey } = event.data;
      window.opengovVotingTool.getWalletAccounts(walletKey).then(result => {
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