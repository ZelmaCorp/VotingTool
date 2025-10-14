<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="dashboard-modal" @click.stop>
      <div class="modal-header">
        <h2>Dashboard & Workflow</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="dashboard-content">
        <!-- Auth Check -->
        <template v-if="!authStore.state.isAuthenticated">
          <div class="auth-required">
          <div class="auth-icon">🔐</div>
          <h3>Authentication Required</h3>
          <p>Please connect your wallet to view your dashboard</p>
          <button @click="$emit('close')" class="connect-btn">Connect Wallet</button>
        </div>
        </template>
        <template v-else>
          <!-- Tab Navigation -->
          <div class="tab-navigation">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'dashboard' }"
              @click="activeTab = 'dashboard'"
            >
              <span class="tab-icon">👤</span>
              <span>My Dashboard</span>
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'workflow' }"
              @click="activeTab = 'workflow'"
            >
              <span class="tab-icon">👥</span>
              <span>Team Workflow</span>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <MyDashboard v-if="activeTab === 'dashboard'" />
            <Workflow v-else />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { authStore } from '../../../stores/authStore'
import MyDashboard from './MyDashboard.vue'
import Workflow from './Workflow.vue'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Add ESC key handler
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Add and remove event listener
onMounted(() => {
  window.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey)
})

const activeTab = ref<'dashboard' | 'workflow'>('dashboard')
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
  z-index: 1000000;
  backdrop-filter: blur(2px);
}

.dashboard-modal {
  background: white;
  border-radius: 12px;
  width: 95vw;
  height: 90vh;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.dashboard-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.auth-required {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.auth-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.auth-required h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.auth-required p {
  margin: 0 0 16px 0;
  color: #666;
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

/* Tab Navigation */
.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: white;
  padding: 0 16px;
}

.tab-btn {
  flex: 1;
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background: #f8f9fa;
}

.tab-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #333;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>