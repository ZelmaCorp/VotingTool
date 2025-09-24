<template>
  <div class="wallet-connect">
    <div class="connect-header">
      <h3>Connect Wallet</h3>
      <button @click="$emit('close')" class="close-btn">✕</button>
    </div>

    <div class="connect-content">
      <!-- Step 1: Wallet Selection -->
      <div v-if="step === 'select'" class="step-content">
        <div class="step-description">
          Choose your Polkadot wallet to connect:
        </div>
        
        <div class="wallet-options">
          <div v-if="availableWallets.length > 0" class="wallet-list">
            <div 
              v-for="wallet in availableWallets" 
              :key="wallet.key"
              @click="connectToWallet(wallet.key)"
              class="wallet-option"
              :disabled="isConnecting"
            >
              <div class="wallet-icon">
                <img 
                  :src="getWalletIcon(wallet.key)" 
                  :alt="wallet.name" 
                  @error="handleIconError"
                  :onerror="`this.style.display='none'; this.nextElementSibling.style.display='block'`"
                />
                <span class="wallet-icon-fallback" style="display: none;">{{ getWalletEmoji(wallet.key) }}</span>
              </div>
              <div class="wallet-info">
                <div class="wallet-name">{{ wallet.name }}</div>
                <div class="wallet-description">Click to connect</div>
              </div>
              <div v-if="isConnecting" class="loading-spinner"></div>
            </div>
          </div>
          
          <div v-else class="no-wallets">
            <div class="no-wallets-icon">⚠️</div>
            <div class="no-wallets-text">No wallet extensions found</div>
          </div>
        </div>

        <!-- Extension Status -->
        <div class="extension-status">
          <div v-if="extensionStatus === 'checking'" class="status-checking">
            🔍 Checking for Polkadot Extension...
          </div>
          <div v-else-if="extensionStatus === 'not-found'" class="status-not-found">
            ⚠️ Polkadot Extension not found
            <div class="status-help">
              Please install the <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener">Polkadot Extension</a> first
            </div>
            <div class="status-actions">
              <button @click="refreshDetection" class="btn-secondary">
                🔄 Refresh Detection
              </button>
              <button @click="manualCheck" class="btn-secondary">
                🔍 Manual Check
              </button>
            </div>
          </div>
          <div v-else-if="extensionStatus === 'found'" class="status-found">
            ✅ Polkadot Extension detected
          </div>
        </div>
      </div>

      <!-- Step 2: Account Selection -->
      <div v-if="step === 'accounts'" class="step-content">
        <div class="step-description">
          Select an account to connect:
        </div>
        
        <div class="account-list">
          <div 
            v-for="account in accounts" 
            :key="account.address"
            @click="selectAccount(account)"
            class="account-item"
            :class="{ selected: selectedAccount?.address === account.address }"
          >
            <div class="account-avatar">
              {{ getAccountInitials(account.name || account.address) }}
            </div>
            <div class="account-info">
              <div class="account-name">{{ account.name || 'Unnamed Account' }}</div>
              <div class="account-address">{{ formatAddress(account.address) }}</div>
            </div>
            <div class="account-check">
              {{ selectedAccount?.address === account.address ? '✓' : '' }}
            </div>
          </div>
        </div>
        
        <div class="step-actions">
          <button @click="step = 'select'" class="btn-secondary">Back</button>
          <button 
            @click="proceedToSign" 
            class="btn-primary"
            :disabled="!selectedAccount"
          >
            Continue
          </button>
        </div>
      </div>

      <!-- Step 3: Signature -->
      <div v-if="step === 'sign'" class="step-content">
        <div class="step-description">
          Sign the message to authenticate:
        </div>
        
        <div class="sign-message">
          <div class="message-label">Message to sign:</div>
          <div class="message-content">{{ messageToSign }}</div>
        </div>
        
        <div class="step-actions">
          <button @click="step = 'accounts'" class="btn-secondary">Back</button>
          <button 
            @click="handleSignMessage" 
            class="btn-primary"
            :disabled="isSigning"
          >
            {{ isSigning ? 'Signing...' : 'Sign Message' }}
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
        <div class="error-actions">
          <button @click="clearError" class="btn-secondary">Try Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { authStore } from '../stores/authStore'
import { formatAddress } from '../utils/teamUtils'

// Extend Window interface for Polkadot extension
declare global {
  interface Window {
    injectedWeb3?: {
      'polkadot-js'?: {
        accounts: {
          get(): Promise<WalletAccount[]>
        }
        signer: {
          signRaw(params: { address: string; data: string; type: string }): Promise<{ signature: string }>
        }
      }
    }
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

interface Account {
  address: string
  name?: string
}

interface WalletAccount {
  address: string
  name?: string
  genesisHash?: string
}

const emit = defineEmits<{
  close: []
}>()

const step = ref<'select' | 'accounts' | 'sign'>('select')
const accounts = ref<Account[]>([])
const selectedAccount = ref<Account | null>(null)
const isConnecting = ref(false)
const isSigning = ref(false)
const error = ref('')
const messageToSign = ref('')
const extensionStatus = ref<'checking' | 'not-found' | 'found'>('checking')

const availableWallets = computed(() => {
  return window.opengovVotingToolResult?.availableWallets || []
})

let checkInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Start checking for the extension
  checkForExtension()
  
  // Set up periodic checking - check more frequently at first
  checkInterval = setInterval(checkForExtension, 1000) // Check every second
  
  // Also check after a short delay to catch late injections
  setTimeout(() => {
    checkForExtension()
  }, 500)
  
  // Check again after 2 seconds
  setTimeout(() => {
    checkForExtension()
  }, 2000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})

const checkForExtension = () => {
  console.log('🔍 Checking for Polkadot Extension...')
  console.log('🔍 Current opengovVotingToolResult:', window.opengovVotingToolResult)
  
  // Check if we have results from the page context
  if (window.opengovVotingToolResult) {
    console.log('📡 Page context result:', window.opengovVotingToolResult)
    
    if (window.opengovVotingToolResult.hasPolkadotExtension === true) {
      console.log('✅ Polkadot Extension found via page context!')
      extensionStatus.value = 'found'
      if (checkInterval) {
        clearInterval(checkInterval)
        checkInterval = null
      }
      return
    }
  }
  
  // Fallback: check directly (might not work due to context isolation)
  console.log('🔍 Checking directly in extension context...')
  console.log('window.injectedWeb3:', window.injectedWeb3)
  console.log('window.injectedWeb3?.["polkadot-js"]:', window.injectedWeb3?.['polkadot-js'])
  
  if (window.injectedWeb3 && window.injectedWeb3['polkadot-js']) {
    console.log('✅ Polkadot Extension found directly!')
    extensionStatus.value = 'found'
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  } else {
    console.log('❌ Polkadot Extension not found')
    extensionStatus.value = 'not-found'
  }
}

// Add a manual check function
const manualCheck = () => {
  console.log('🔄 Manual check triggered...')
  console.log('🔍 Current opengovVotingToolResult:', window.opengovVotingToolResult)
  
  // Trigger a page context check
  window.postMessage({
    type: 'CHECK_WALLET_EXTENSION'
  }, '*')
  
  // Wait a moment and check again
  setTimeout(() => {
    console.log('🔍 After manual check, opengovVotingToolResult:', window.opengovVotingToolResult)
    if (window.opengovVotingToolResult?.hasPolkadotExtension) {
      console.log('✅ Manual check found extension!')
      extensionStatus.value = 'found'
    }
  }, 1000)
}

const refreshDetection = () => {
  extensionStatus.value = 'checking'
  checkForExtension()
}

const connectToWallet = async (walletKey: string) => {
  try {
    isConnecting.value = true
    error.value = ''
    
    console.log('🔗 Connecting to wallet:', walletKey)
    
    // Send connect request to page context
    window.postMessage({
      type: 'CONNECT_WALLET',
      walletKey: walletKey
    }, '*')
    
    // Wait for the connection result
    let attempts = 0
    const maxAttempts = 20 // Wait up to 10 seconds
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500))
      attempts++
      
      if (window.opengovVotingToolResult?.connectionResult) {
        const result = window.opengovVotingToolResult.connectionResult
        
        if (result.success) {
          console.log('✅ Wallet connected successfully:', result.accounts)
          accounts.value = result.accounts
          step.value = 'accounts'
          return
        } else {
          throw new Error(result.error || 'Failed to connect wallet')
        }
      }
    }
    
    // If we get here, we didn't receive a result
    throw new Error('Timeout waiting for wallet connection')
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to connect to wallet'
    console.error('Wallet connection error:', err)
  } finally {
    isConnecting.value = false
  }
}

const selectAccount = (account: Account) => {
  selectedAccount.value = account
}

const proceedToSign = () => {
  if (!selectedAccount.value) return
  
  // Generate sign message
  messageToSign.value = `Authenticate with OpenGov Voting Tool\n\nAddress: ${selectedAccount.value.address}\nTimestamp: ${Date.now()}\n\nClick "Sign Message" to continue.`
  
  step.value = 'sign'
}

const handleSignMessage = async () => {
  if (!selectedAccount.value) return
  
  try {
    isSigning.value = true
    error.value = ''
    
    console.log('✍️ Sending sign message request to page context...')
    console.log('✍️ Account:', selectedAccount.value.address)
    console.log('✍️ Message:', messageToSign.value)
    
    // Send sign request to page context
    window.postMessage({
      type: 'SIGN_MESSAGE',
      address: selectedAccount.value.address,
      message: messageToSign.value
    }, '*')
    
    // Wait for the signature result
    let attempts = 0
    const maxAttempts = 20 // Wait up to 10 seconds
    
    console.log('⏳ Waiting for signature result...')
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500))
      attempts++
      
      console.log(`🔍 Attempt ${attempts}/${maxAttempts}: Checking for signature result...`)
      console.log('🔍 Current opengovVotingToolResult:', window.opengovVotingToolResult)
      console.log('🔍 signatureResult:', window.opengovVotingToolResult?.signatureResult)
      
      if (window.opengovVotingToolResult?.signatureResult) {
        const result = window.opengovVotingToolResult.signatureResult
        
        console.log('🎯 Found signature result:', result)
        
        if (result.success && result.signature) {
          console.log('✅ Received signature from page context:', result.signature)
          console.log('🚀 Starting authentication with authStore.login...')
          
          // Attempt login with the signature
          const loginResult = await authStore.login(
            selectedAccount.value.address,
            result.signature,
            messageToSign.value
          )
          
          console.log('🔐 Authentication result:', loginResult)
          
          if (loginResult.success) {
            console.log('🎉 Authentication successful!')
            emit('close')
          } else {
            console.log('❌ Authentication failed:', loginResult.error)
            
            // Check if this is a multisig access denied error
            if (loginResult.details && loginResult.details.reason) {
              error.value = formatMultisigError(loginResult.details)
            } else {
              error.value = loginResult.error || 'Authentication failed. Please try again.'
            }
          }
          return
        } else {
          console.log('❌ Signature result indicates failure:', result)
          throw new Error(result.error || 'Failed to sign message')
        }
      }
    }
    
    // If we get here, we didn't receive a signature
    console.log('⏰ Timeout waiting for signature result')
    throw new Error('Timeout waiting for signature from Polkadot Extension')
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to sign message'
    console.error('Signature error:', err)
  } finally {
    isSigning.value = false
  }
}

const getAccountInitials = (name: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getWalletIcon = (walletKey: string) => {
  // Return the path to the wallet icon SVG using chrome.runtime.getURL
  const getIconPath = (iconName: string) => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL(`icons/${iconName}`)
    }
    return `/icons/${iconName}` // Fallback
  }
  
  switch (walletKey) {
    case 'polkadot-js':
      return getIconPath('wallet-polkadot-js.svg')
    case 'talisman':
      return getIconPath('wallet-talisman.svg')
    case 'subwallet':
    case 'subwallet-js':
    case 'SubWallet':
      return getIconPath('wallet-subwallet.svg')
    case 'nova-wallet':
      return getIconPath('wallet-nova.svg')
    default:
      return getIconPath('wallet-default.svg')
  }
}

const getWalletEmoji = (walletKey: string) => {
  // Fallback emoji icon when SVG fails to load - same for all wallets
  return '💼' // Generic wallet icon for all wallets
}

const handleIconError = (event: Event) => {
  // This function is called when an image fails to load
  // The onerror inline handler will handle the fallback display
  console.log('Wallet icon failed to load, falling back to emoji')
}

const clearError = () => {
  error.value = ''
  step.value = 'select'
}

const formatMultisigError = (details: any) => {
  if (!details) return 'Access denied: Not authorized as multisig member'
  
  const address = details.address || 'your wallet address'
  const suggestion = details.suggestion || 'Please contact an administrator to add your address to the multisig'
  
  let configuredMultisigs = ''
  if (details.configured_multisigs) {
    const multisigs = []
    if (details.configured_multisigs.polkadot && details.configured_multisigs.polkadot !== 'Not configured') {
      multisigs.push(`Polkadot: ${details.configured_multisigs.polkadot}`)
    }
    if (details.configured_multisigs.kusama && details.configured_multisigs.kusama !== 'Not configured') {
      multisigs.push(`Kusama: ${details.configured_multisigs.kusama}`)
    }
    if (multisigs.length > 0) {
      configuredMultisigs = `\n\nConfigured multisigs:\n${multisigs.join('\n')}`
    }
  }
  
  return `🚫 Access Denied: Multisig Member Required

${details.reason || 'Your wallet address is not registered as a multisig member.'}

Your address: ${address}${configuredMultisigs}

💡 ${suggestion}`
}
</script>

<style scoped>
.wallet-connect {
  min-width: 400px;
  max-width: 500px;
}

.connect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e5e9;
}

.connect-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.step-content {
  margin-bottom: 24px;
}

.step-description {
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.wallet-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wallet-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.wallet-option:hover:not(:disabled) {
  border-color: #e6007a;
  box-shadow: 0 2px 8px rgba(230, 0, 122, 0.1);
}

.wallet-option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wallet-icon {
  width: 32px;
  height: 32px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.wallet-icon-fallback {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-info {
  flex: 1;
}

.wallet-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.wallet-description {
  font-size: 14px;
  color: #666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #e6007a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.extension-status {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
}

.status-checking {
  color: #0066cc;
  font-weight: 500;
}

.status-not-found {
  color: #dc3545;
  font-weight: 500;
}

.status-found {
  color: #28a745;
  font-weight: 500;
}

.status-help {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.status-help a {
  color: #e6007a;
  text-decoration: none;
  font-weight: 500;
}

.status-help a:hover {
  text-decoration: underline;
}

.status-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.account-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.account-item:last-child {
  border-bottom: none;
}

.account-item:hover {
  background-color: #f8f9fa;
}

.account-item.selected {
  background-color: #e8f4fd;
  border-left: 3px solid #e6007a;
}

.account-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #e6007a, #ff1493);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  margin-right: 12px;
}

.account-info {
  flex: 1;
}

.account-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.account-address {
  font-family: monospace;
  font-size: 12px;
  color: #666;
}

.account-check {
  color: #e6007a;
  font-weight: bold;
  font-size: 18px;
}

.sign-message {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.message-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.message-content {
  font-family: monospace;
  font-size: 12px;
  color: #666;
  white-space: pre-wrap;
  word-break: break-all;
}

.step-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.error-message {
  text-align: left;
  padding: 24px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}

.error-text {
  color: #c53030;
  font-weight: 500;
  white-space: pre-line;
  line-height: 1.5;
  margin-bottom: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.error-actions {
  display: flex;
  justify-content: center;
}

.no-wallets {
  text-align: center;
  padding: 24px;
  color: #666;
}

.no-wallets-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.no-wallets-text {
  font-size: 14px;
}
</style> 