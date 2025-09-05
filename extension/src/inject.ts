// OpenGov VotingTool Extension - Page Context Injector
// This script runs in the page context, not the extension context
// It has access to window.injectedWeb3 and can interact with wallet extensions

console.log('🚀 OpenGov VotingTool: Page context injector loaded')

// Global object to store results
;(window as any).opengovVotingTool = {
  // Check if wallet extensions are available
  checkWalletExtension: function() {
    console.log('🔍 Page context: checking for wallet extensions...')
    console.log('🔍 Page context: window.injectedWeb3 =', window.injectedWeb3)
    console.log('🔍 Page context: Object.keys(window.injectedWeb3 || {}) =', Object.keys(window.injectedWeb3 || {}))
    
    const availableWallets = []
    
    // Check Polkadot Extension
    if (window.injectedWeb3?.['polkadot-js']) {
      console.log('✅ Found Polkadot Extension')
      availableWallets.push({
        name: 'Polkadot Extension',
        key: 'polkadot-js'
      })
    }
    
    // Check Talisman
    if (window.injectedWeb3?.talisman) {
      console.log('✅ Found Talisman')
      availableWallets.push({
        name: 'Talisman',
        key: 'talisman'
      })
    }
    
    // Check Subwallet - try multiple possible keys
    const subwalletKeys = ['subwallet-js', 'subwallet', 'SubWallet']
    for (const key of subwalletKeys) {
      if (window.injectedWeb3?.[key]) {
        console.log(`✅ Found Subwallet with key: ${key}`)
        availableWallets.push({
          name: 'Subwallet',
          key: key
        })
        break // Only add once
      }
    }
    
    console.log('🔍 Page context: available wallets =', availableWallets)
    
    return {
      hasPolkadotExtension: availableWallets.length > 0,
      availableWallets: availableWallets,
      timestamp: Date.now()
    }
  },
  
  // Get accounts from a specific wallet
  getWalletAccounts: async function(walletKey: string) {
    try {
      console.log('📋 Page context: getting accounts from wallet:', walletKey)
      
      if (!window.injectedWeb3?.[walletKey]) {
        throw new Error(`Wallet ${walletKey} not available`)
      }
      
      // Enable the wallet
      console.log('🔗 Page context: enabling wallet:', walletKey)
      const enabledWallet = await window.injectedWeb3[walletKey].enable()
      console.log('✅ Page context: wallet enabled:', enabledWallet)
      
      // Get accounts
      console.log('📋 Page context: getting accounts...')
      const walletAccounts = await enabledWallet.accounts.get()
      console.log('📋 Page context: raw wallet accounts =', walletAccounts)
      console.log('📋 Page context: got', walletAccounts.length, 'accounts')
      
      if (walletAccounts.length === 0) {
        throw new Error(`No accounts found in ${walletKey}`)
      }
      
      // Transform accounts to simple objects
      const accounts = walletAccounts.map((acc: any) => ({
        address: acc.address,
        name: acc.name || 'Unnamed Account',
        wallet: walletKey
      }))
      
      console.log('📋 Page context: transformed accounts =', accounts)
      
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
      console.log('✍️ Page context: signing message for address:', address)
      
      // We need to re-enable the wallet for signing since we don't store the enabled state
      // Let's try all available wallets to see which one has this address
      const wallets = ['polkadot-js', 'talisman', 'subwallet-js', 'subwallet', 'SubWallet']
      
      for (const walletKey of wallets) {
        try {
          console.log('🔗 Page context: trying to enable wallet for signing:', walletKey)
          
          if (!window.injectedWeb3?.[walletKey]) {
            continue // Try next wallet
          }
          
          // Enable the wallet
          const enabledWallet = await window.injectedWeb3[walletKey].enable()
          console.log('✅ Page context: wallet enabled for signing:', walletKey)
          
          // Get accounts to check if this address belongs to this wallet
          const accounts = await enabledWallet.accounts.get()
          const hasAddress = accounts.some((acc: any) => acc.address === address)
          
          if (hasAddress) {
            console.log('✅ Page context: found address in wallet:', walletKey)
            
            // Sign the message
            const { signature } = await enabledWallet.signer.signRaw({
              address: address,
              data: message,
              type: 'bytes'
            })
            
            console.log('✅ Page context: message signed successfully')
            return {
              success: true,
              signature: signature,
              message: 'Message signed successfully',
              wallet: walletKey
            }
          }
        } catch (walletError) {
          console.log('⚠️ Page context: failed to use wallet:', walletKey, walletError)
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
      console.log('✍️ Page context: signing transaction for address:', address)
      
      // Similar logic to signMessage but for transactions
      const wallets = ['polkadot-js', 'talisman', 'subwallet-js', 'subwallet', 'SubWallet']
      
      for (const walletKey of wallets) {
        try {
          if (!window.injectedWeb3?.[walletKey]) {
            continue
          }
          
          const enabledWallet = await window.injectedWeb3[walletKey].enable()
          const accounts = await enabledWallet.accounts.get()
          const hasAddress = accounts.some((acc: any) => acc.address === address)
          
          if (hasAddress) {
            console.log('✅ Page context: found address in wallet:', walletKey)
            
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
          console.log('⚠️ Page context: failed to use wallet:', walletKey, walletError)
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
  
  console.log('📡 Page context: received message:', event.data.type)
  
  if (event.data.type === 'CHECK_WALLET_EXTENSION') {
    const result = window.opengovVotingTool.checkWalletExtension()
    window.postMessage({
      type: 'WALLET_EXTENSION_RESULT',
      data: result
    }, '*')
  }
  
  if (event.data.type === 'CONNECT_WALLET') {
    const { walletKey } = event.data
    window.opengovVotingTool.getWalletAccounts(walletKey).then((result: any) => {
      window.postMessage({
        type: 'WALLET_CONNECTION_RESULT',
        data: result
      }, '*')
    })
  }
  
  if (event.data.type === 'SIGN_MESSAGE') {
    const { address, message } = event.data
    window.opengovVotingTool.signMessage(address, message).then((result: any) => {
      window.postMessage({
        type: 'SIGNATURE_RESULT',
        data: result
      }, '*')
    })
  }
  
  if (event.data.type === 'SIGN_TRANSACTION') {
    const { address, transaction } = event.data
    window.opengovVotingTool.signTransaction(address, transaction).then((result: any) => {
      window.postMessage({
        type: 'TRANSACTION_SIGNATURE_RESULT',
        data: result
      }, '*')
    })
  }
})

// Initial check and notification
console.log('🚀 Page context script loaded')
const initialResult = window.opengovVotingTool.checkWalletExtension()
if (initialResult.hasPolkadotExtension) {
  console.log('🎉 Page context: Initial check found wallet extensions!')
  window.postMessage({
    type: 'WALLET_EXTENSION_DETECTED',
    data: initialResult
  }, '*')
}

// Notify that the injector is ready
window.postMessage({
  type: 'INJECTOR_READY',
  data: { timestamp: Date.now() }
}, '*') 