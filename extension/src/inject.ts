// OpenGov VotingTool Extension - Page Context Injector
// This script runs in the page context, not the extension context
// It has access to window.injectedWeb3 and can interact with wallet extensions

// Global object to store results
;(window as any).opengovVotingTool = {
  // Check if wallet extensions are available
  checkWalletExtension: function() {
    const availableWallets = []
    
    // Check if injectedWeb3 exists at all
    if (!(window as any).injectedWeb3) {
      return {
        hasPolkadotExtension: false,
        availableWallets: [],
        timestamp: Date.now(),
        debug: 'window.injectedWeb3 not found'
      }
    }
    
    const injectedWeb3 = (window as any).injectedWeb3
    
    // Check Polkadot Extension
    if (injectedWeb3['polkadot-js']) {
      availableWallets.push({
        name: 'Polkadot Extension',
        key: 'polkadot-js'
      })
    }
    
    // Check Talisman
    if (injectedWeb3.talisman) {
      availableWallets.push({
        name: 'Talisman',
        key: 'talisman'
      })
    }
    
    // Check Subwallet (multiple possible keys)
    const subwalletKeys = ['subwallet-js', 'SubWallet', 'subwallet']
    for (const key of subwalletKeys) {
      if (injectedWeb3[key]) {
        availableWallets.push({
          name: 'SubWallet',
          key: key
        })
        break // Only add once even if multiple keys exist
      }
    }
    
    return {
      hasPolkadotExtension: availableWallets.length > 0,
      availableWallets: availableWallets,
      timestamp: Date.now(),
      debug: `Found ${availableWallets.length} wallets from keys: ${Object.keys(injectedWeb3).join(', ')}`
    }
  },
  
  // Get accounts from a specific wallet
  getWalletAccounts: async function(walletKey: string) {
    try {
      const injectedWeb3 = (window as any).injectedWeb3
      if (!injectedWeb3?.[walletKey]) {
        throw new Error(`Wallet ${walletKey} not available`)
      }
      
      // Enable the wallet
      const enabledWallet = await injectedWeb3[walletKey].enable()
      
      // Get accounts
      const walletAccounts = await enabledWallet.accounts.get()
      
      if (walletAccounts.length === 0) {
        throw new Error(`No accounts found in ${walletKey}`)
      }
      
      // Transform accounts to simple objects
      const accounts = walletAccounts.map((acc: any) => ({
        address: acc.address,
        name: acc.name || 'Unnamed Account',
        wallet: walletKey
      }))
      
      return {
        success: true,
        accounts: accounts,
        wallet: walletKey,
        message: `Connected to ${walletKey} successfully`
      }
      
    } catch (error: any) {
      console.error(`❌ Page context: Failed to get accounts from ${walletKey}:`, error)
      return {
        success: false,
        error: error.message,
        wallet: walletKey
      }
    }
  },
  
  // Sign a message
  signMessage: async function(address: string, message: string) {
    try {
      // We need to re-enable the wallet for signing since we don't store the enabled state
      // Let's try all available wallets to see which one has this address
      const wallets = ['polkadot-js', 'talisman', 'subwallet', 'subwallet-js', 'SubWallet']
      const injectedWeb3 = (window as any).injectedWeb3
      
      for (const walletKey of wallets) {
        try {
          if (!injectedWeb3?.[walletKey]) {
            continue // Try next wallet
          }
          
          // Enable the wallet
          const enabledWallet = await injectedWeb3[walletKey].enable()
          
          // Get accounts to check if this address belongs to this wallet
          const accounts = await enabledWallet.accounts.get()
          const hasAddress = accounts.some((acc: any) => acc.address === address)
          
          if (hasAddress) {
            // Sign the message
            const { signature } = await enabledWallet.signer.signRaw({
              address: address,
              data: message,
              type: 'bytes'
            })
            
            return {
              success: true,
              signature: signature,
              message: 'Message signed successfully',
              wallet: walletKey
            }
          }
        } catch (walletError) {
          continue // Try next wallet
        }
      }
      
      throw new Error('Could not find or enable wallet for this address')
      
    } catch (error: any) {
      console.error('❌ Page context: Failed to sign message:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },
  
  // Sign a transaction (for future use)
  signTransaction: async function(address: string, transaction: any) {
    try {
      // Similar logic to signMessage but for transactions
      const wallets = ['polkadot-js', 'talisman', 'subwallet', 'subwallet-js', 'SubWallet']
      const injectedWeb3 = (window as any).injectedWeb3
      
      for (const walletKey of wallets) {
        try {
          if (!injectedWeb3?.[walletKey]) {
            continue
          }
          
          const enabledWallet = await injectedWeb3[walletKey].enable()
          const accounts = await enabledWallet.accounts.get()
          const hasAddress = accounts.some((acc: any) => acc.address === address)
          
          if (hasAddress) {
            // Sign the transaction
            const { signature } = await enabledWallet.signer.signRaw({
              address: address,
              data: transaction,
              type: 'bytes'
            })
            
            return {
              success: true,
              signature: signature,
              message: 'Transaction signed successfully',
              wallet: walletKey
            }
          }
        } catch (walletError) {
          continue
        }
      }
      
      throw new Error('Could not find or enable wallet for this address')
      
    } catch (error: any) {
      console.error('❌ Page context: Failed to sign transaction:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Listen for messages from the extension context
window.addEventListener('message', function(event) {
  if (event.source !== window) return
  
  if (event.data.type === 'CHECK_WALLET_EXTENSION') {
    const result = (window as any).opengovVotingTool.checkWalletExtension()
    window.postMessage({
      type: 'WALLET_EXTENSION_RESULT',
      data: result
    }, '*')
  }
  
  if (event.data.type === 'CONNECT_WALLET') {
    const { walletKey } = event.data;
    (window as any).opengovVotingTool.getWalletAccounts(walletKey).then((result: any) => {
      window.postMessage({
        type: 'WALLET_CONNECTION_RESULT',
        data: result
      }, '*')
    })
  }
  
  if (event.data.type === 'SIGN_MESSAGE') {
    const { address, message } = event.data;
    (window as any).opengovVotingTool.signMessage(address, message).then((result: any) => {
      window.postMessage({
        type: 'SIGNATURE_RESULT',
        data: result
      }, '*')
    })
  }
  
  if (event.data.type === 'SIGN_TRANSACTION') {
    const { address, transaction } = event.data;
    (window as any).opengovVotingTool.signTransaction(address, transaction).then((result: any) => {
      window.postMessage({
        type: 'TRANSACTION_SIGNATURE_RESULT',
        data: result
      }, '*')
    })
  }
})

// Function to do delayed checks for wallet extensions
function performWalletCheck() {
  const result = (window as any).opengovVotingTool.checkWalletExtension()
  
  // Store result globally for access by extension context
  ;(window as any).opengovVotingToolResult = {
    hasPolkadotExtension: result.hasPolkadotExtension,
    availableWallets: result.availableWallets,
    timestamp: result.timestamp,
    debug: result.debug
  }
  
  if (result.hasPolkadotExtension) {
    window.postMessage({
      type: 'WALLET_EXTENSION_DETECTED',
      data: result
    }, '*')
  }
  
  return result
}

// Initial check and notification
performWalletCheck()

// Check again after delays to catch late injections
setTimeout(() => {
  performWalletCheck()
}, 500)

setTimeout(() => {
  performWalletCheck()
}, 1000)

setTimeout(() => {
  performWalletCheck()
}, 2000)

// Notify that the injector is ready
window.postMessage({
  type: 'INJECTOR_READY',
  data: { timestamp: Date.now() }
}, '*')

// Export empty object to make this a module
export {} 