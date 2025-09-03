// OpenGov VotingTool Extension - Content Script
// This will be the main entry point for the extension

import { createApp } from 'vue'
import App from './App.vue'

// Create the extension container
const extensionContainer = document.createElement('div')
extensionContainer.id = 'opengov-voting-extension'
extensionContainer.style.position = 'fixed'
extensionContainer.style.top = '0'
extensionContainer.style.left = '0'
extensionContainer.style.width = '100%'
extensionContainer.style.height = '100%'
extensionContainer.style.pointerEvents = 'none'
extensionContainer.style.zIndex = '999999'

// Append to the page
document.body.appendChild(extensionContainer)

// Initialize the extension
createApp(App).mount('#opengov-voting-extension') 