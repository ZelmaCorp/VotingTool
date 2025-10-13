// OpenGov VotingTool Extension - Popup
// This will be the main entry point for the popup

import { createApp } from 'vue'
import App from './App.vue'
import '../design-system.css'

// Create and mount Vue app
function initializeVueApp() {
  // Create a container for the Vue app
  const container = document.createElement('div')
  container.id = 'opengov-voting-extension-popup'
  document.body.appendChild(container)
  
  // Create and mount Vue app
  const app = createApp(App)
  app.mount('#opengov-voting-extension-popup')
}

// Initialize when popup loads
initializeVueApp() 