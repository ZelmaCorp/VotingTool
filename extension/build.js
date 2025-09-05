import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build configuration
const BUILD_CONFIG = {
  chrome: {
    distDir: 'dist-chrome',
    manifestFile: 'manifest.json',
    description: 'Chrome/Brave/Edge (Chromium-based)'
  },
  firefox: {
    distDir: 'dist-firefox', 
    manifestFile: 'manifest-firefox.json',
    description: 'Firefox/Gecko-based'
  }
};

// Function to create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Function to copy file from source to destination
function copyFile(sourcePath, destPath) {
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    return true;
  } else {
    console.log(`⚠️  Warning: ${sourcePath} not found, skipping...`);
    return false;
  }
}

// Function to copy directory recursively
function copyDir(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`⚠️  Warning: ${sourceDir} not found, skipping...`);
    return;
  }
  
  ensureDir(destDir);
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

// Function to build for a specific browser
function buildForBrowser(browser) {
  const config = BUILD_CONFIG[browser];
  console.log(`\n🔨 Building for ${config.description}...`);
  
  // Create browser-specific dist directory
  ensureDir(config.distDir);
  
  // Copy Vite build files from dist-temp
  if (fs.existsSync('dist-temp')) {
    const tempFiles = fs.readdirSync('dist-temp');
    tempFiles.forEach(file => {
      const sourcePath = path.join('dist-temp', file);
      const destPath = path.join(config.distDir, file);
      
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${file} → ${config.distDir}/${file}`);
      }
    });
  } else {
    console.log('⚠️  Warning: dist-temp/ directory not found');
  }
  
  // Copy the appropriate manifest file as manifest.json
  const manifestSource = config.manifestFile;
  const manifestDest = path.join(config.distDir, 'manifest.json');
  
  if (copyFile(manifestSource, manifestDest)) {
    console.log(`✅ Copied ${manifestSource} → ${config.distDir}/manifest.json`);
  }
  
  // Copy CSS files
  const cssFiles = ['design-system.css', 'overlay.css'];
  cssFiles.forEach(file => {
    copyFile(file, path.join(config.distDir, file));
  });
  
  // Copy icons directory
  copyDir('icons', path.join(config.distDir, 'icons'));
  
  // Copy popup.html
  if (fs.existsSync('popup.html')) {
    copyFile('popup.html', path.join(config.distDir, 'popup.html'));
  } else {
    // Create default popup.html
    const defaultPopupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenGov VotingTool</title>
    <link rel="stylesheet" href="design-system.css">
    <link rel="stylesheet" href="overlay.css">
</head>
<body>
    <div id="app"></div>
    <script src="popup.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(config.distDir, 'popup.html'), defaultPopupHtml);
    console.log(`✅ Created default popup.html in ${config.distDir}/`);
  }
  
  // Verify required files
  const requiredFiles = ['content.js', 'popup.js', 'background.js', 'inject.js', 'manifest.json'];
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(config.distDir, file);
    if (!fs.existsSync(filePath)) {
      allFilesExist = false;
      console.log(`❌ Missing: ${config.distDir}/${file}`);
    }
  });
  
  if (allFilesExist) {
    console.log(`✅ ${config.description} build completed successfully!`);
  } else {
    console.log(`❌ ${config.description} build has missing files!`);
  }
  
  return allFilesExist;
}

// Main build process
console.log('🚀 Starting dual browser build process...\n');

// Build for both browsers
const chromeSuccess = buildForBrowser('chrome');
const firefoxSuccess = buildForBrowser('firefox');

// Clean up temp directory after both builds are done
if (fs.existsSync('dist-temp')) {
  fs.rmSync('dist-temp', { recursive: true, force: true });
  console.log('🧹 Cleaned up dist-temp/ directory');
}

// Summary
console.log('\n📊 Build Summary:');
console.log(`📁 dist-chrome/ - ${chromeSuccess ? '✅ Success' : '❌ Failed'} (Chrome/Brave/Edge)`);
console.log(`📁 dist-firefox/ - ${firefoxSuccess ? '✅ Success' : '❌ Failed'} (Firefox)`);

// List contents of both directories
['chrome', 'firefox'].forEach(browser => {
  const config = BUILD_CONFIG[browser];
  console.log(`\n📁 Contents of ${config.distDir}/:`);
  if (fs.existsSync(config.distDir)) {
    const contents = fs.readdirSync(config.distDir, { recursive: true });
    contents.forEach(item => {
      const stats = fs.statSync(path.join(config.distDir, item));
      const type = stats.isDirectory() ? '📁' : '📄';
      console.log(`  ${type} ${item}`);
    });
  }
});

console.log('\n🎯 Installation Instructions:');
console.log('🦊 Firefox: about:debugging > This Firefox > Load Temporary Add-on > select dist-firefox/ folder');
console.log('🌐 Chrome: chrome://extensions > Developer mode > Load unpacked > select dist-chrome/ folder');
console.log('🛡️  Brave: brave://extensions > Developer mode > Load unpacked > select dist-chrome/ folder');

if (chromeSuccess && firefoxSuccess) {
  console.log('\n🎉 All builds completed successfully!');
  console.log('✨ Both browsers are ready for testing!');
} else {
  console.log('\n⚠️  Some builds failed. Please check the errors above.');
}
