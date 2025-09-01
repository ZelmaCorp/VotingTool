// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

import { createApp } from 'vue'
import App from './App.vue'

console.log('🚀 OpenGov VotingTool Extension loaded!')
console.log('📍 Current URL:', window.location.href)
console.log('🔍 Vue version:', createApp ? 'Available' : 'NOT AVAILABLE')
console.log('🔍 App component:', App ? 'Available' : 'NOT AVAILABLE')

// Create and mount Vue app
function initializeVueApp() {
  try {
    console.log('🎯 Starting Vue app initialization...')
    
    // Create a container for the Vue app
    const container = document.createElement('div')
    container.id = 'voting-tool-app'
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      background: white;
      border: 5px solid #e6007a;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-width: 400px;
      font-family: Arial, sans-serif;
      font-size: 16px;
    `
    
    // Add some immediate visible content
    container.innerHTML = '<div style="color: red; font-size: 24px; font-weight: bold;">🚨 EXTENSION LOADING 🚨</div>'
    
    // Add to page
    document.body.appendChild(container)
    console.log('✅ Container added to page')
    
    // Create Vue app
    const app = createApp(App)
    console.log('✅ Vue app created')
    
    // Mount the app
    app.mount('#voting-tool-app')
    console.log('✅ Vue app mounted successfully!')
    
    // Add success message
    container.innerHTML += '<div style="color: green; font-size: 18px; margin-top: 10px;">✅ VUE APP MOUNTED!</div>'
    
  } catch (error: any) {
    console.error('❌ Error initializing Vue app:', error)
    
    // Show error on page
    const errorContainer = document.createElement('div')
    errorContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      background: #ff0000;
      color: white;
      border: 3px solid #cc0000;
      border-radius: 10px;
      padding: 20px;
      max-width: 400px;
      font-family: Arial, sans-serif;
      font-size: 16px;
    `
    errorContainer.innerHTML = `
      <div style="font-size: 20px; font-weight: bold;">❌ EXTENSION ERROR</div>
      <div style="margin-top: 10px;">${error?.message || 'Unknown error'}</div>
    `
    document.body.appendChild(errorContainer)
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