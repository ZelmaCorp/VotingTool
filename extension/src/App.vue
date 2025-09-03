<template>
  <div id="voting-tool-app" class="voting-tool-container">
    <!-- Floating Button -->
    <div class="floating-button" @click="toggleMenu" :class="{ 'menu-open': isMenuOpen }">
      <div class="button-icon">
        <span v-if="!isMenuOpen">🗳️</span>
        <span v-else>✕</span>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div v-if="isMenuOpen" class="dropdown-menu">
      <div class="menu-header">
        <h3>OpenGov VotingTool</h3>
        <p>Extension loaded successfully!</p>
      </div>
      
      <div class="menu-content">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
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
.voting-tool-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  /* Remove any background that might be covering the page */
}

/* Floating Button */
.floating-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #e6007a, #ff1493);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(230, 0, 122, 0.4);
  transition: all 0.3s ease;
  border: 3px solid white;
}

.floating-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(230, 0, 122, 0.6);
}

.floating-button.menu-open {
  background: linear-gradient(135deg, #ff1493, #e6007a);
}

.button-icon {
  font-size: 24px;
  color: white;
  font-weight: bold;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 70px;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-header {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
  padding: 20px;
  text-align: center;
}

.menu-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.menu-header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.menu-content {
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
</style> 