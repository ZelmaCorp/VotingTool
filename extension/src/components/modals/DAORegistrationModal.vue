<template>
  <div v-if="show" class="modal-overlay" @click="handleClose">
    <div class="registration-modal" @click.stop>
      <div class="modal-header">
        <h3>Register Your DAO</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="modal-content">
        <div v-if="!isRegistering && !registrationSuccess" class="registration-form">
          <div class="info-section">
            <div class="info-icon">🏛️</div>
            <p class="info-text">
              Register your DAO by providing a multisig address. The system will automatically verify 
              that you are a member of this multisig on-chain before allowing registration.
            </p>
          </div>

          <div class="form-section">
            <div class="form-group">
              <label for="dao-name">DAO Name *</label>
              <input
                id="dao-name"
                v-model="daoName"
                type="text"
                class="form-input"
                placeholder="e.g., My DAO"
                :disabled="isRegistering"
              />
              <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            </div>

            <div class="form-group">
              <label for="dao-description">Description (Optional)</label>
              <textarea
                id="dao-description"
                v-model="description"
                class="form-input"
                rows="3"
                placeholder="Brief description of your DAO..."
                :disabled="isRegistering"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="polkadot-multisig">Polkadot Multisig Address</label>
              <input
                id="polkadot-multisig"
                v-model="polkadotMultisig"
                type="text"
                class="form-input"
                placeholder="1... (Polkadot address)"
                :disabled="isRegistering"
              />
              <div class="input-help">
                Can be a direct multisig or a proxy address. Leave empty if your DAO only uses Kusama.
              </div>
              <div v-if="errors.polkadotMultisig" class="error-message">{{ errors.polkadotMultisig }}</div>
            </div>

            <div class="form-group">
              <label for="kusama-multisig">Kusama Multisig Address</label>
              <input
                id="kusama-multisig"
                v-model="kusamaMultisig"
                type="text"
                class="form-input"
                placeholder="D... (Kusama address)"
                :disabled="isRegistering"
              />
              <div class="input-help">
                Can be a direct multisig or a proxy address. Leave empty if your DAO only uses Polkadot.
              </div>
              <div v-if="errors.kusamaMultisig" class="error-message">{{ errors.kusamaMultisig }}</div>
            </div>
          </div>

          <div v-if="errorMessage" class="error-banner">
            <strong>Registration Failed:</strong>
            <p>{{ errorMessage }}</p>
            <ul v-if="errorDetails && errorDetails.length > 0">
              <li v-for="(detail, index) in errorDetails" :key="index">{{ detail }}</li>
            </ul>
          </div>
        </div>

        <div v-if="isRegistering" class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">Verifying multisig membership on-chain...</p>
          <p class="loading-subtext">This may take a few moments</p>
        </div>

        <div v-if="registrationSuccess" class="success-state">
          <div class="success-icon">✅</div>
          <h4>Registration Successful!</h4>
          <p>Your DAO <strong>{{ daoName }}</strong> has been registered successfully.</p>
          <p class="success-subtext">You can now access all features of the voting tool.</p>
        </div>

        <div v-if="!isRegistering && !registrationSuccess" class="modal-actions">
          <button class="btn btn-secondary" @click="handleClose" :disabled="isRegistering">
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            @click="handleRegister"
            :disabled="isRegistering || !isFormValid"
          >
            {{ isRegistering ? 'Registering...' : 'Register DAO' }}
          </button>
        </div>

        <div v-if="registrationSuccess" class="modal-actions">
          <button class="btn btn-primary" @click="handleComplete">
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { authStore } from '../../stores/authStore'
import { ApiService } from '../../utils/apiService'

interface DAORegistrationModalProps {
  show: boolean
}

defineProps<DAORegistrationModalProps>()
const emit = defineEmits<{
  close: []
  registered: [daoName: string]
}>()

const daoName = ref('')
const description = ref('')
const polkadotMultisig = ref('')
const kusamaMultisig = ref('')
const isRegistering = ref(false)
const registrationSuccess = ref(false)
const errorMessage = ref('')
const errorDetails = ref<string[]>([])
const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  return daoName.value.trim().length > 0 && 
         (polkadotMultisig.value.trim().length > 0 || kusamaMultisig.value.trim().length > 0)
})

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!daoName.value.trim()) {
    errors.value.name = 'DAO name is required'
  }
  
  if (!polkadotMultisig.value.trim() && !kusamaMultisig.value.trim()) {
    errors.value.polkadotMultisig = 'At least one multisig address is required'
    errors.value.kusamaMultisig = 'At least one multisig address is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  if (!authStore.state.user?.address) {
    errorMessage.value = 'No wallet address found. Please reconnect your wallet.'
    return
  }
  
  isRegistering.value = true
  errorMessage.value = ''
  errorDetails.value = []
  
  try {
    // Request signature from user's wallet
    const message = `Register DAO: ${daoName.value.trim()}\nTimestamp: ${Date.now()}`
    
    // Request signature through extension wallet
    const signature = await requestWalletSignature(message)
    
    if (!signature) {
      errorMessage.value = 'Signature was cancelled or failed. Please ensure your wallet extension is unlocked and has access to the address you authenticated with.'
      isRegistering.value = false
      return
    }
    
    // Call API to register DAO
    const apiService = ApiService.getInstance()
    const result = await apiService.registerDAO({
      name: daoName.value.trim(),
      description: description.value.trim() || undefined,
      polkadotMultisig: polkadotMultisig.value.trim() || undefined,
      kusamaMultisig: kusamaMultisig.value.trim() || undefined,
      walletAddress: authStore.state.user.address,
      signature,
      message
    })
    
    if (result.success) {
      registrationSuccess.value = true
      
      // Setup DAO context after successful registration
      await authStore.setupDaoContext(apiService)
      
      // Emit event for parent component
      emit('registered', daoName.value.trim())
    } else {
      errorMessage.value = result.error || 'Registration failed'
      errorDetails.value = result.errors || []
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || 'An unexpected error occurred during registration'
  } finally {
    isRegistering.value = false
  }
}

const requestWalletSignature = async (message: string): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!authStore.state.user?.address) {
      console.error('❌ No user address available')
      resolve(null)
      return
    }
    
    console.log('🔐 Requesting signature for address:', authStore.state.user.address)
    console.log('📝 Message to sign:', message)
    
    // Clear any previous result
    if ((window as any).opengovVotingToolResult) {
      delete (window as any).opengovVotingToolResult.signatureResult
    }
    
    // Send sign request to page context (inject.ts)
    window.postMessage({
      type: 'SIGN_MESSAGE',
      address: authStore.state.user.address,
      message: message // Plain text message
    }, '*')
    
    // Wait for the signature result (with timeout)
    let attempts = 0
    const maxAttempts = 160 // Wait up to 80 seconds
    
    const checkInterval = setInterval(() => {
      attempts++
      
      if ((window as any).opengovVotingToolResult?.signatureResult) {
        clearInterval(checkInterval)
        const result = (window as any).opengovVotingToolResult.signatureResult
        
        if (result.success && result.signature) {
          console.log('✅ Signature received from wallet:', result.wallet)
          resolve(result.signature)
        } else {
          console.error('❌ Signature failed:', result.error)
          resolve(null)
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        console.error('❌ Signature request timed out after 80 seconds')
        resolve(null)
      }
    }, 500)
  })
}

const handleClose = () => {
  if (!isRegistering.value) {
    emit('close')
  }
}

const handleComplete = () => {
  emit('close')
}

// ESC key handler
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !isRegistering.value) {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.registration-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #e6007a, #b3005f);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-content {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.info-section {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #f0f8ff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #e6007a;
  margin-bottom: 24px;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-text {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #e6007a;
  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);
}

.form-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.input-help {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.error-message {
  margin-top: 6px;
  font-size: 12px;
  color: #dc3545;
}

.error-banner {
  margin-top: 20px;
  padding: 16px;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
}

.error-banner strong {
  display: block;
  margin-bottom: 8px;
}

.error-banner p {
  margin: 4px 0;
}

.error-banner ul {
  margin: 8px 0 0 20px;
  padding: 0;
}

.error-banner li {
  margin: 4px 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #e6007a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
}

.loading-subtext {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.success-state h4 {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 12px 0;
}

.success-state p {
  font-size: 1rem;
  color: #666;
  margin: 8px 0;
}

.success-subtext {
  font-size: 0.9rem;
  color: #999;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-primary {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b3005f, #cc1177);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>

