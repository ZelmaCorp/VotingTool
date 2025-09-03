<template>
  <div id="voting-tool-app" class="voting-tool-container">
    <!-- Floating Button -->
    <div class="floating-button" @click="toggleMenu" :class="{ 'menu-open': isMenuOpen }">
      <div class="button-icon">
        <div v-if="!isMenuOpen" class="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span v-else>✕</span>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div v-if="isMenuOpen" class="dropdown-menu">
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

.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
}

.hamburger-icon span {
  width: 20px;
  height: 2px;
  background-color: white;
  border-radius: 1px;
  transition: all 0.3s ease;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  bottom: 0;
  right: 70px;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  overflow: hidden;
  animation: smoothExpand 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: bottom right;
}

@keyframes smoothExpand {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
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