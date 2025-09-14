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
      </div>
    </div>

    <!-- Menu Items -->
    <div class="menu-items">
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
        @click="handleAction('my-dashboard')"
        title="My assignments & actions needed"
      >
        <span class="icon">👤</span>
        <span>My Dashboard</span>
      </div>
      
      <div 
        class="menu-item" 
        @click="handleAction('team-workflow')"
        title="Team collaboration & approvals"
      >
        <span class="icon">👥</span>
        <span>Team Workflow</span>
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

    <!-- My Dashboard Modal -->
    <MyDashboard 
      :show="showMyDashboard"
      @close="showMyDashboard = false"
    />

    <!-- Team Workflow Modal -->
    <TeamWorkflow 
      :show="showTeamWorkflow"
      @close="showTeamWorkflow = false"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authStore } from '../../stores/authStore'
import { formatAddress } from '../../utils/teamUtils'
import WalletConnect from '../WalletConnect.vue'
import DAOConfigModal from '../modals/DAOConfigModal.vue'
import ProposalBrowser from './ProposalBrowser.vue'
import MyDashboard from './MyDashboard.vue'
import TeamWorkflow from './TeamWorkflow.vue'
import SettingsMore from './SettingsMore.vue'

const showWalletConnect = ref(false)
const showDAOConfig = ref(false)
const showProposalBrowser = ref(false)
const showMyDashboard = ref(false)
const showTeamWorkflow = ref(false)
const showSettingsMore = ref(false)

const getUserInitials = () => {
  const name = authStore.state.user?.name
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const handleLogout = async () => {
  await authStore.logout()
}

const handleAction = (action: string) => {
  switch (action) {
    case 'browse-proposals':
      showProposalBrowser.value = true
      break
    case 'my-dashboard':
      showMyDashboard.value = true
      break
    case 'team-workflow':
      showTeamWorkflow.value = true
      break
    case 'settings-more':
      showSettingsMore.value = true
      break
  }
}

const handleConfigSaved = () => {
  showDAOConfig.value = false
}
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
</style> 