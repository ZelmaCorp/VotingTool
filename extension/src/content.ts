// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

import { createApp } from 'vue'
import App from './App.vue'

console.log('OpenGov VotingTool Extension loaded!')
console.log('Current URL:', window.location.href)

// Create and mount Vue app
function initializeVueApp() {
  try {
    console.log('Initializing Vue app...')
    
    // Create a dedicated container for the Vue app
    const container = document.createElement('div')
    container.id = 'voting-tool-extension-container'
    // Don't add any styling here - let Vue handle everything
    document.body.appendChild(container)
    console.log('Container added to page')
    
    // Create Vue app
    const app = createApp(App)
    console.log('Vue app created')
    
    // Mount the app to the dedicated container
    app.mount('#voting-tool-extension-container')
    console.log('Vue app mounted successfully!')
        
  } catch (error: any) {
    console.error('❌ Error initializing Vue app:', error)
  }
}

// Wait for page to load
if (document.readyState === 'loading') {
  console.log('📄 Page still loading, waiting for DOMContentLoaded...')
  document.addEventListener('DOMContentLoaded', initializeVueApp)
} else {
  console.log('📄 Page already loaded, initializing immediately...')
  initializeVueApp()
}

// TODO: Initialize Vue app and mount components
// TODO: Set up content script functionality
// TODO: Handle proposal detection and overlay creation 