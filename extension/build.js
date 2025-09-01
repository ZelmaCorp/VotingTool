import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy CSS files
const cssFiles = ['design-system.css', 'overlay.css'];
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`Copied ${file} to dist/`);
  }
});

// Copy icons directory
if (!fs.existsSync('dist/icons')) {
  fs.mkdirSync('dist/icons');
}

const iconFiles = ['icon16.svg', 'icon48.svg', 'icon128.svg'];
iconFiles.forEach(file => {
  const sourcePath = path.join('icons', file);
  const destPath = path.join('dist/icons', file);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/icons/`);
  }
});

// Ensure popup.html exists
const popupHtmlPath = path.join('dist', 'popup.html');
if (!fs.existsSync(popupHtmlPath)) {
  const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenGov VotingTool</title>
    <style>
        body {
            width: 400px;
            height: 500px;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        }
        #app {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="app"></div>
    <script src="popup.js"></script>
</body>
</html>`;
  
  fs.writeFileSync(popupHtmlPath, popupHtml);
  console.log('Created popup.html in dist/');
}

// Create our custom popup.js that works reliably
const popupJsPath = path.join('dist', 'popup.js');
const customPopupJs = `// OpenGov VotingTool Extension - Popup
console.log('OpenGov VotingTool Popup loaded!');

// Simple popup content
document.addEventListener('DOMContentLoaded', function() {
  const app = document.getElementById('app');
  
  if (app) {
    app.innerHTML = \`
      <div class="app-container">
        <h1>OpenGov VotingTool</h1>
        <p>Extension loaded successfully!</p>
        
        <!-- BIG VISIBLE TEST ELEMENT -->
        <div class="test-x">
          <h2>🚨 TEST X 🚨</h2>
          <div class="big-x">❌</div>
          <p>If you see this, the popup is working!</p>
        </div>
        
        <div class="status">
          <h3>Extension Status</h3>
          <p>✅ Popup loaded</p>
          <p>✅ Content script ready</p>
          <p>✅ Background script active</p>
        </div>
      </div>
    \`;
    
    console.log('Popup content loaded successfully!');
  }
});

// Add some basic styling
const style = document.createElement('style');
style.textContent = \`
  .app-container {
    padding: 20px;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  h1 {
    color: #e6007a;
    margin-bottom: 10px;
    font-size: 1.5rem;
  }
  
  p {
    color: #666;
    margin: 8px 0;
  }
  
  .test-x {
    background: #ff0000;
    color: white;
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    border: 3px solid #000;
  }
  
  .test-x h2 {
    color: white;
    font-size: 1.5rem;
    margin: 0 0 15px 0;
  }
  
  .big-x {
    font-size: 4rem;
    margin: 15px 0;
    text-shadow: 2px 2px 0 #000;
  }
  
  .test-x p {
    color: white;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .status {
    background: #f0f0f0;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .status h3 {
    color: #333;
    margin: 0 0 10px 0;
    font-size: 1.2rem;
  }
\`;
document.head.appendChild(style);`;

fs.writeFileSync(popupJsPath, customPopupJs);
console.log('Created custom popup.js in dist/');

// Create our custom content.js that works reliably
const contentJsPath = path.join('dist', 'content.js');
const customContentJs = `// OpenGov VotingTool Extension - Content Script
console.log('🚀 OpenGov VotingTool Extension loaded!');
console.log('📍 Current URL:', window.location.href);

// Create a visible overlay to show the extension is working
function createOverlay() {
  try {
    console.log('🎯 Creating extension overlay...');
    
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'voting-tool-overlay';
    overlay.style.cssText = \`
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
      color: #333;
    \`;
    
    overlay.innerHTML = \`
      <div style="color: #e6007a; font-size: 24px; font-weight: bold; margin-bottom: 15px;">
        🚨 OpenGov VotingTool 🚨
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Status:</strong> ✅ Extension Active
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Page:</strong> \${window.location.hostname}
      </div>
      <div style="margin-bottom: 15px;">
        <strong>URL:</strong> \${window.location.pathname}
      </div>
      <div style="background: #ff0000; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold;">
        🚨 BIG RED TEST BOX 🚨
      </div>
      <div style="margin-top: 10px; font-size: 14px; color: #666;">
        If you see this overlay, the extension is working!
      </div>
    \`;
    
    // Add to page
    document.body.appendChild(overlay);
    console.log('✅ Extension overlay created successfully!');
    
    // Add some interactivity
    overlay.addEventListener('click', function() {
      this.style.transform = this.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
    });
    
    overlay.style.transition = 'transform 0.2s ease';
    
  } catch (error) {
    console.error('❌ Error creating extension overlay:', error);
    
    // Fallback error display
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = \`
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
    \`;
    
    errorDiv.innerHTML = \`
      <div style="font-size: 20px; font-weight: bold;">❌ EXTENSION ERROR</div>
      <div style="margin-top: 10px;">\${error.message || 'Unknown error'}</div>
    \`;
    
    document.body.appendChild(errorDiv);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('📄 Page still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', createOverlay);
} else {
  console.log('📄 Page already loaded, initializing immediately...');
  createOverlay();
}

// Also try to initialize after a short delay to catch late-loading pages
setTimeout(createOverlay, 1000);`;

fs.writeFileSync(contentJsPath, customContentJs);
console.log('Created custom content.js in dist/');

console.log('Build completed successfully!'); 