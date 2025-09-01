// Popup script for Polkassembly Overlay Extension
document.addEventListener('DOMContentLoaded', function() {
  const showOverlayButton = document.getElementById('show-overlay');
  const statusText = document.getElementById('status');
  
  // Check if we're on a supported site
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    if (url && (url.includes('polkassembly.io') || url.includes('subsquare.io'))) {
      statusText.textContent = 'Extension is active on this page';
      showOverlayButton.disabled = false;
    } else {
      statusText.textContent = 'Navigate to Polkassembly or Subsquare to use this extension';
      showOverlayButton.disabled = true;
    }
  });
  
  // Handle show overlay button click
  showOverlayButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: showOverlay
      });
    });
  });
});

// Function to show overlay (will be injected into the page)
function showOverlay() {
  // Remove existing overlay if present
  const existingOverlay = document.getElementById('polkassembly-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create new overlay
  const overlay = document.createElement('div');
  overlay.id = 'polkassembly-overlay';
  overlay.className = 'polkassembly-overlay';
  
  const overlayContent = document.createElement('div');
  overlayContent.className = 'overlay-content';
  overlayContent.innerHTML = `
    <h2>Hello World!</h2>
    <p>Polkassembly Overlay Extension is working!</p>
    <button id="close-overlay">Close</button>
  `;
  
  overlay.appendChild(overlayContent);
  
  // Add close functionality
  const closeButton = overlay.querySelector('#close-overlay');
  closeButton.addEventListener('click', () => {
    overlay.remove();
  });
  
  // Add to page
  document.body.appendChild(overlay);
  
  console.log('Overlay created from popup!');
} 