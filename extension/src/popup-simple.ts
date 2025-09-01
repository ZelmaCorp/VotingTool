// Simple popup without Vue imports
console.log('🚀 OpenGov VotingTool Popup loaded!')

function initializePopup() {
  console.log('🎯 Starting popup initialization...')
  
  // Create popup content
  const popupContent = document.createElement('div')
  popupContent.style.cssText = `
    padding: 20px;
    font-family: Arial, sans-serif;
    min-width: 300px;
  `
  
  popupContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #e6007a; margin: 0; font-size: 24px;">OpenGov VotingTool</h1>
      <p style="color: #666; margin: 10px 0 0 0;">Extension loaded successfully!</p>
    </div>
    
    <div style="background: #f5f5f5; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
      <h3 style="margin: 0 0 10px 0; color: #333;">Status</h3>
      <div style="color: #00aa00; font-weight: bold;">✅ Extension Active</div>
      <div style="color: #666; font-size: 14px; margin-top: 5px;">Ready to use on Polkassembly</div>
    </div>
    
    <div style="background: #e6007a; color: white; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; margin-bottom: 15px;">
      <div style="font-weight: bold;">🎯 Open Voting Tool</div>
      <div style="font-size: 14px; opacity: 0.9;">Click to open on current page</div>
    </div>
    
    <div style="background: #f0f0f0; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer;">
      <div style="font-weight: bold; color: #333;">📊 View All Proposals</div>
      <div style="font-size: 14px; color: #666;">See your voting history</div>
    </div>
  `
  
  // Add click handlers
  const openToolButton = popupContent.querySelector('div[style*="background: #e6007a"]')
  if (openToolButton) {
    openToolButton.addEventListener('click', () => {
      console.log('🎯 Opening voting tool on current page...')
      // This would communicate with the content script
    })
  }
  
  const viewProposalsButton = popupContent.querySelector('div[style*="background: #f0f0f0"]')
  if (viewProposalsButton) {
    viewProposalsButton.addEventListener('click', () => {
      console.log('📊 Opening proposals view...')
      // This would open a new tab or view
    })
  }
  
  // Replace the popup content
  document.body.innerHTML = ''
  document.body.appendChild(popupContent)
  
  console.log('✅ Popup initialized successfully!')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('📄 Popup still loading, waiting for DOMContentLoaded...')
  document.addEventListener('DOMContentLoaded', initializePopup)
} else {
  console.log('📄 Popup already loaded, initializing immediately...')
  initializePopup()
} 