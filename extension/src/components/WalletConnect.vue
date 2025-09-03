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
          <button 
            @click="connectPolkadotExtension" 
            class="wallet-option"
            :disabled="isConnecting"
          >
            <div class="wallet-icon">🔗</div>
            <div class="wallet-info">
              <div class="wallet-name">Polkadot Extension</div>
              <div class="wallet-description">Browser extension wallet</div>
            </div>
            <div v-if="isConnecting" class="loading-spinner"></div>
          </button>
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
        <button @click="clearError" class="btn-secondary">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { authStore } from '../stores/authStore'

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

let checkInterval: number | null = null

onMounted(() => {
  // Start checking for the extension
  checkForExtension()
  
  // Set up periodic checking
  checkInterval = setInterval(checkForExtension, 2000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})

const checkForExtension = () => {
  if (window.injectedWeb3 && window.injectedWeb3['polkadot-js']) {
    extensionStatus.value = 'found'
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  } else {
    extensionStatus.value = 'not-found'
  }
}

const connectPolkadotExtension = async () => {
  try {
    isConnecting.value = true
    error.value = ''
    
    // Check if extension is available
    if (!window.injectedWeb3 || !window.injectedWeb3['polkadot-js']) {
      throw new Error('Polkadot Extension not available. Please install it first.')
    }

    // Connect to extension
    const extension = window.injectedWeb3['polkadot-js']
    const walletAccounts = await extension.accounts.get()
    
    if (walletAccounts.length === 0) {
      throw new Error('No accounts found in Polkadot Extension. Please create or import an account.')
    }

    // Transform accounts to our format
    accounts.value = walletAccounts.map((acc: WalletAccount) => ({
      address: acc.address,
      name: acc.name
    }))

    step.value = 'accounts'
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
    
    // Get the extension
    const extension = window.injectedWeb3?.['polkadot-js']
    if (!extension) {
      throw new Error('Polkadot Extension not available')
    }
    
    // Sign the message
    const { signature } = await extension.signer.signRaw({
      address: selectedAccount.value.address,
      data: messageToSign.value,
      type: 'bytes'
    })
    
    // Attempt login with the signature
    const success = await authStore.login(
      selectedAccount.value.address,
      signature,
      messageToSign.value
    )
    
    if (success) {
      emit('close')
    } else {
      error.value = 'Authentication failed. Please try again.'
    }
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

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const clearError = () => {
  error.value = ''
  step.value = 'select'
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
  font-size: 24px;
  margin-right: 16px;
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
  text-align: center;
  padding: 24px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.error-text {
  color: #c53030;
  margin-bottom: 16px;
  font-weight: 500;
}
</style> 