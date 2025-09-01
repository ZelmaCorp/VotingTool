// Content script for Polkassembly Overlay Extension
console.log('Polkassembly Overlay Extension loaded!');

// Create and inject the overlay
function createOverlay() {
  // Check if overlay already exists
  if (document.getElementById('polkassembly-overlay')) {
    return;
  }

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'polkassembly-overlay';
  overlay.className = 'polkassembly-overlay';
  
  // Create overlay content
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
  
  console.log('Overlay created successfully!');
}

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createOverlay);
} else {
  createOverlay();
}

// Also create overlay when navigating (for SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(createOverlay, 1000); // Wait for page to render
  }
}).observe(document, {subtree: true, childList: true}); 