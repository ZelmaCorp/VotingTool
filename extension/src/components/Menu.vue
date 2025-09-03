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
      <div class="menu-item" @click="handleAction('proposals')">
        <span class="icon">📋</span>
        <span>View Proposals</span>
      </div>
      
      <div class="menu-item" @click="handleAction('voting')">
        <span class="icon">✅</span>
        <span>Voting History</span>
      </div>
      
      <div class="menu-item" @click="handleAction('settings')">
        <span class="icon">⚙️</span>
        <span>Settings</span>
      </div>
      
      <div class="menu-item" @click="handleAction('help')">
        <span class="icon">❓</span>
        <span>Help</span>
      </div>
    </div>

    <!-- Wallet Connect Modal -->
    <div v-if="showWalletConnect" class="modal-overlay" @click="showWalletConnect = false">
      <div class="modal-content" @click.stop>
        <WalletConnect @close="showWalletConnect = false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authStore } from '../stores/authStore'
import WalletConnect from './WalletConnect.vue'

const showWalletConnect = ref(false)

const getUserInitials = () => {
  const name = authStore.state.user?.name
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatAddress = (address?: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const handleLogout = async () => {
  await authStore.logout()
}

const handleAction = (action: string) => {
  console.log(`Action clicked: ${action}`)
  // Handle different actions here
  switch (action) {
    case 'proposals':
      // Handle proposals view
      break
    case 'voting':
      // Handle voting history
      break
    case 'settings':
      // Handle settings
      break
    case 'help':
      // Handle help
      break
  }
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
  padding: 16px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item .icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.menu-item span:last-child {
  font-size: 14px;
  color: #333;
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