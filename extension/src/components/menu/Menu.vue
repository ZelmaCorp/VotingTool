<template>
  <div class="menu-container">
    <!-- User Status Section -->
    <div class="user-status">
      <div v-if="authStore.state.isAuthenticated" class="user-info">
        <div class="user-avatar">
          {{ getUserInitials() }}
        </div>
        <div class="user-details">
          <div class="user-name">{{ authStore.state.user?.name || 'Unknown User' }}</div>
          <div class="user-address">{{ formatAddress(authStore.state.user?.address) }}</div>
          <div class="user-network">{{ authStore.state.user?.network }}</div>
        </div>
        <button @click="handleLogout" class="logout-btn" :disabled="authStore.state.isLoading">
          {{ authStore.state.isLoading ? '...' : 'Logout' }}
        </button>
      </div>
      
      <div v-else class="login-prompt">
        <div class="login-icon">🔐</div>
        <div class="login-text">Connect your wallet to continue</div>
        <button @click="showWalletConnect = true" class="connect-btn">
          Connect Wallet
        </button>
        <button @click="handleAction('settings-more')" class="settings-link-btn">
          ⚙️ Configure Backend URL
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="authStore.state.isAuthenticated && isCheckingDaoMembership" class="loading-container">
      <div class="spinner-small"></div>
      <p class="loading-text">Checking DAO membership...</p>
    </div>

    <!-- DAO Registration Prompt -->
    <div v-if="authStore.state.isAuthenticated && !isCheckingDaoMembership && !isDaoMember" class="registration-prompt">
      <div class="prompt-icon">🏛️</div>
      <h4>Register Your DAO</h4>
      <p>To access the voting tool features, you need to register your DAO's multisig.</p>
      <button @click="handleAction('register-dao')" class="register-btn">
        Register DAO
      </button>
      <p class="prompt-note">
        You must be a member of the multisig to complete registration.
      </p>
      <button @click="handleAction('settings-more')" class="settings-link-btn-small">
        ⚙️ Settings
      </button>
    </div>

    <!-- Menu Items (only shown when user is DAO member) -->
    <div v-if="authStore.state.isAuthenticated && !isCheckingDaoMembership && isDaoMember" class="menu-items">
      <div 
        class="menu-item" 
        @click="handleAction('browse-proposals')"
        title="All proposals with advanced filters"
      >
        <span class="icon">📋</span>
        <span>Browse Proposals</span>
      </div>
      
      <div 
        class="menu-item" 
        @click="handleAction('unified-dashboard')"
        title="My dashboard & team workflow"
      >
        <span class="icon">📊</span>
        <span>Dashboard & Workflow</span>
      </div>
      
      <div 
        class="menu-item" 
        @click="handleAction('settings-more')"
        title="Configuration, history & help"
      >
        <span class="icon">⚙️</span>
        <span>Settings & More</span>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showWalletConnect" class="modal-overlay" @click="showWalletConnect = false">
      <div class="modal-content" @click.stop>
        <WalletConnect @close="showWalletConnect = false" />
      </div>
    </div>

    <!-- Browse Proposals Modal -->
    <ProposalBrowser 
      :show="showProposalBrowser"
      @close="showProposalBrowser = false"
    />

    <!-- Dashboard Modal -->
    <Dashboard
      :show="showUnifiedDashboard"
      @close="showUnifiedDashboard = false"
    />

    <!-- Settings & More Modal -->
    <SettingsMore 
      :show="showSettingsMore"
      @close="showSettingsMore = false"
    />

    <!-- DAO Config Modal -->
    <DAOConfigModal 
      :show="showDAOConfig"
      @close="showDAOConfig = false"
      @saved="handleConfigSaved"
    />

    <!-- DAO Registration Modal -->
    <DAORegistrationModal 
      :show="showDAORegistration"
      @close="showDAORegistration = false"
      @registered="handleDaoRegistered"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { authStore } from '../../stores/authStore'
import { formatAddress } from '../../utils/teamUtils'
import { ApiService } from '../../utils/apiService'
import WalletConnect from '../WalletConnect.vue'
import DAOConfigModal from '../modals/DAOConfigModal.vue'
import DAORegistrationModal from '../modals/DAORegistrationModal.vue'
import ProposalBrowser from './ProposalBrowser.vue'
import SettingsMore from './SettingsMore.vue'
import Dashboard from './Dashboard/Dashboard.vue'

const showWalletConnect = ref(false)
const showDAOConfig = ref(false)
const showDAORegistration = ref(false)
const showProposalBrowser = ref(false)
const showUnifiedDashboard = ref(false)
const showSettingsMore = ref(false)
const isDaoMember = ref(false)
const isCheckingDaoMembership = ref(false)

const getUserInitials = () => {
  const name = authStore.state.user?.name
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const handleLogout = async () => {
  await authStore.logout()
  isDaoMember.value = false
}

const handleAction = (action: string) => {
  switch (action) {
    case 'browse-proposals':
      showProposalBrowser.value = true
      break
    case 'unified-dashboard':
      showUnifiedDashboard.value = true
      break
    case 'settings-more':
      showSettingsMore.value = true
      break
    case 'register-dao':
      showDAORegistration.value = true
      break
  }
}

const handleConfigSaved = () => {
  showDAOConfig.value = false
}

const handleDaoRegistered = async (daoName: string) => {
  console.log('DAO registered:', daoName)
  showDAORegistration.value = false
  
  // Re-check DAO membership
  await checkDaoMembership()
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('daoRegistered', { 
    detail: { daoName } 
  }))
}

const checkDaoMembership = async () => {
  if (!authStore.state.isAuthenticated) {
    isDaoMember.value = false
    return
  }
  
  isCheckingDaoMembership.value = true
  
  try {
    const apiService = ApiService.getInstance()
    const config = await apiService.getDAOConfig()
    
    if (config && config.name) {
      isDaoMember.value = true
      console.log('✅ User is member of DAO:', config.name)
    } else {
      isDaoMember.value = false
      console.log('ℹ️ User is not a member of any DAO - registration required')
    }
  } catch (error: any) {
    console.error('❌ Error checking DAO membership:', error)
    
    // If this is a 403 error (not a DAO member), that's expected
    // If it's a 401 error, the token is invalid - logout
    if (error.status === 401) {
      console.warn('⚠️ Token invalid, logging out...')
      await authStore.logout()
    }
    
    isDaoMember.value = false
  } finally {
    isCheckingDaoMembership.value = false
  }
}

// Check DAO membership when component mounts
onMounted(() => {
  checkDaoMembership()
})

// Watch for authentication changes
watch(() => authStore.state.isAuthenticated, (newValue) => {
  if (newValue) {
    checkDaoMembership()
  } else {
    isDaoMember.value = false
  }
})

// Listen for auth state changes from wallet connection
window.addEventListener('authStateChanged', () => {
  checkDaoMembership()
})
</script>

<style scoped>
.menu-container {
  width: 100%;
}

.user-status {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e6007a, #ff1493);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
}

.user-address {
  font-family: monospace;
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.user-network {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover:not(:disabled) {
  background: #c82333;
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 20px 0;
}

.login-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.login-text {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.connect-btn {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.menu-item .icon {
  font-size: 1.25rem;
  width: 1.5rem;
  text-align: center;
}

.menu-item span:not(.icon) {
  font-size: 1rem;
  color: #2d3748;
  font-weight: 500;
}

/* Modal styles */
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

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.spinner-small {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #e6007a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* Registration prompt */
.registration-prompt {
  padding: 32px 20px;
  text-align: center;
  background: linear-gradient(135deg, #fff5f7, #fef5f8);
  border-radius: 12px;
  margin: 16px;
  border: 2px dashed #e6007a;
}

.prompt-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.registration-prompt h4 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.registration-prompt p {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.register-btn {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(230, 0, 122, 0.2);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(230, 0, 122, 0.3);
}

.prompt-note {
  font-size: 0.85rem !important;
  color: #999 !important;
  margin-top: 16px !important;
  font-style: italic;
}

.settings-link-btn {
  background: transparent;
  color: #666;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
}

.settings-link-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.settings-link-btn-small {
  background: transparent;
  color: #666;
  border: 1px solid #dee2e6;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
}

.settings-link-btn-small:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}
</style> 