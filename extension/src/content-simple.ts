// Simple content script without Vue imports
console.log('🚀 OpenGov VotingTool Extension loaded!')
console.log('📍 Current URL:', window.location.href)

// Create a very visible test element
function createTestElement() {
  const testDiv = document.createElement('div')
  testDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: #e6007a;
    color: white;
    border: 5px solid #000000;
    border-radius: 15px;
    padding: 30px;
    font-family: Arial, sans-serif;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 8px 30px rgba(0,0,0,0.7);
    max-width: 400px;
  `
  testDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 32px; margin-bottom: 15px;">🎉</div>
      <div style="font-size: 28px; margin-bottom: 10px;">EXTENSION WORKS!</div>
      <div style="font-size: 18px; opacity: 0.9;">OpenGov VotingTool</div>
      <div style="font-size: 16px; margin-top: 15px; opacity: 0.8;">
        Content script loaded successfully
      </div>
    </div>
  `
  
  return testDiv
}

// Initialize when DOM is ready
function initialize() {
  try {
    console.log('🎯 Starting content script initialization...')
    
    // Create and add test element
    const testElement = createTestElement()
    document.body.appendChild(testElement)
    console.log('✅ Test element added to page')
    
    // Add success message
    testElement.innerHTML += `
      <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 10px; text-align: center;">
        <div style="color: #00ff00; font-size: 20px; font-weight: bold;">✅ SUCCESS!</div>
        <div style="font-size: 14px; margin-top: 5px;">Extension is working on this page</div>
      </div>
    `
    
  } catch (error) {
    console.error('❌ Error in content script:', error)
    
    // Show error on page
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = `
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
    errorDiv.innerHTML = `
      <div style="font-size: 20px; font-weight: bold;">❌ EXTENSION ERROR</div>
      <div style="margin-top: 10px;">${error?.message || 'Unknown error'}</div>
    `
    document.body.appendChild(errorDiv)
  }
}

// Wait for page to load
if (document.readyState === 'loading') {
  console.log('📄 Page still loading, waiting for DOMContentLoaded...')
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  console.log('📄 Page already loaded, initializing immediately...')
  initialize()
} 