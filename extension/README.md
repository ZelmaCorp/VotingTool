# OpenGov VotingTool Browser Extension

A browser extension that overlays on Polkassembly and Subsquare to help you vote on OpenGov proposals.

## Features

- ✅ Works in both Chrome and Firefox
- ✅ SVG icons (no PNG dependencies)
- ✅ Simple, reliable popup interface
- ✅ Content script overlay on Polkassembly and Subsquare
- ✅ Background script for extension management

## Installation

### Chrome/Chromium-based browsers

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist/` folder from this extension
5. The extension should now appear in your extensions list

### Firefox

1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" tab
3. Click "Load Temporary Add-on"
4. Select the `manifest-firefox.json` file from this extension
5. The extension should now appear in your extensions list

## Testing

1. After installation, you should see the OpenGov VotingTool extension icon in your browser toolbar
2. Click the extension icon to open the popup
3. You should see a red test box with "🚨 TEST X 🚨" and a large ❌
4. The popup should display "Extension loaded successfully!" and status information

## Development

### Building

```bash
npm install
npm run build
```

This will:
- Build the Vue components with Vite
- Copy necessary CSS and icon files to `dist/`
- Create a working popup.html and popup.js
- Ensure all files are properly structured for browser extension loading

### File Structure

```
dist/
├── icons/           # SVG icons for the extension
├── popup.html      # Main popup interface
├── popup.js        # Popup functionality
├── content.js      # Content script for overlays
├── background.js   # Background script
├── design-system.css # Design system styles
└── overlay.css     # Overlay-specific styles
```

## Troubleshooting

- **Extension not visible**: Make sure you're loading the `dist/` folder, not the root extension folder
- **Popup not working**: Check browser console for errors, ensure all files are in the `dist/` folder
- **Icons not showing**: Verify SVG files are properly copied to `dist/icons/`

## Browser Compatibility

- Chrome/Chromium: Manifest V3
- Firefox: Manifest V2 (with browser-specific settings)
- Both use the same codebase with different manifest files 