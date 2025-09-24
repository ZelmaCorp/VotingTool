# Official Wallet Icons Download Guide

## Method 1: Direct Downloads from Official Sources

### Polkadot.js Extension
- **GitHub**: https://github.com/polkadot-js/extension/tree/master/packages/extension/public/images
- **Icon URL**: https://raw.githubusercontent.com/polkadot-js/extension/master/packages/extension/public/images/icon-128.png

### Talisman
- **GitHub**: https://github.com/TalismanSociety/talisman/tree/dev/apps/extension/public/images
- **Icon URL**: https://raw.githubusercontent.com/TalismanSociety/talisman/dev/apps/extension/public/images/icon-128.png

### SubWallet  
- **GitHub**: https://github.com/Koniverse/SubWallet-Extension/tree/master/packages/extension/public/images
- **Icon URL**: https://raw.githubusercontent.com/Koniverse/SubWallet-Extension/master/packages/extension/public/images/icon-128.png

### Fearless Wallet
- **Chrome Store**: Extract from extension or find in their GitHub
- **Alternative**: https://fearlesswallet.io/ (right-click save favicon)

### Nova Wallet
- **Website**: https://novawallet.io/ (save favicon or logo)
- **GitHub**: https://github.com/nova-wallet

## Method 2: Extract from Browser Extensions

If you have the extensions installed:

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Find the extension
4. Click "Details"
5. The icon is usually in the extension folder under `icons/` or `images/`

## Method 3: Download Script

Run these commands to download official icons:

```bash
# Create a temp directory
mkdir -p temp-icons

# Download Polkadot.js icon
curl -o temp-icons/polkadot-js.png "https://raw.githubusercontent.com/polkadot-js/extension/master/packages/extension/public/images/icon-128.png"

# Download Talisman icon  
curl -o temp-icons/talisman.png "https://raw.githubusercontent.com/TalismanSociety/talisman/dev/apps/extension/public/images/icon-128.png"

# Download SubWallet icon
curl -o temp-icons/subwallet.png "https://raw.githubusercontent.com/Koniverse/SubWallet-Extension/master/packages/extension/public/images/icon-128.png"
```

## Method 4: Convert PNG to SVG

After downloading PNG icons, convert them to SVG:

```bash
# Using ImageMagick (if installed)
convert polkadot-js.png polkadot-js.svg

# Or use online converters:
# - https://convertio.co/png-svg/
# - https://cloudconvert.com/png-to-svg
# - https://www.freeconvert.com/png-to-svg
```

## Recommended Approach

1. Download the PNG icons from GitHub repositories
2. Convert to SVG using online tools
3. Optimize SVG files for web use
4. Replace the current icons in `/extension/icons/` 