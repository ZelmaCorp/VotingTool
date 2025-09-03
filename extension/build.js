import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting OpenGov VotingTool Extension build...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
  console.log('✅ Created dist/ directory');
}

// Copy Vite build files from dist-temp to dist
if (fs.existsSync('dist-temp')) {
  console.log('📁 Copying Vite build files from dist-temp...');
  
  const tempFiles = fs.readdirSync('dist-temp');
  tempFiles.forEach(file => {
    const sourcePath = path.join('dist-temp', file);
    const destPath = path.join('dist', file);
    
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file} to dist/`);
    }
  });
  
  // Clean up temp directory
  fs.rmSync('dist-temp', { recursive: true, force: true });
  console.log('🧹 Cleaned up dist-temp/ directory');
} else {
  console.log('⚠️  Warning: dist-temp/ directory not found');
}

// Copy manifest files
const manifestFiles = ['manifest.json', 'manifest-firefox.json'];
manifestFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`✅ Copied ${file} to dist/`);
  } else {
    console.log(`⚠️  Warning: ${file} not found, skipping...`);
  }
});

// Copy CSS files
const cssFiles = ['design-system.css', 'overlay.css'];
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`✅ Copied ${file} to dist/`);
  } else {
    console.log(`⚠️  Warning: ${file} not found, skipping...`);
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
    console.log(`✅ Copied ${file} to dist/icons/`);
  } else {
    console.log(`⚠️  Warning: ${file} not found, skipping...`);
  }
});

// Copy popup.html
if (fs.existsSync('popup.html')) {
  fs.copyFileSync('popup.html', path.join('dist', 'popup.html'));
  console.log('✅ Copied popup.html to dist/');
} else {
  console.log('⚠️  Warning: popup.html not found, creating default...');
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
  
  fs.writeFileSync(path.join('dist', 'popup.html'), defaultPopupHtml);
  console.log('✅ Created default popup.html in dist/');
}

// Verify that all required files exist
const requiredFiles = ['content.js', 'popup.js', 'background.js'];
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join('dist', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} found in dist/`);
  } else {
    console.log(`❌ ${file} NOT found in dist/`);
    allFilesExist = false;
  }
});

// Verify manifest files exist
const requiredManifests = ['manifest.json', 'manifest-firefox.json'];
let allManifestsExist = true;

requiredManifests.forEach(file => {
  const filePath = path.join('dist', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} found in dist/`);
  } else {
    console.log(`❌ ${file} NOT found in dist/`);
    allManifestsExist = false;
  }
});

if (!allFilesExist || !allManifestsExist) {
  console.log('\n🚨 WARNING: Some required files are missing!');
  if (!allFilesExist) {
    console.log('- Missing JavaScript files');
  }
  if (!allManifestsExist) {
    console.log('- Missing manifest files');
  }
  console.log('Please check the build process and ensure all files were copied successfully.\n');
} else {
  console.log('\n🎉 All required files are present in dist/');
}

// List all files in dist for verification
console.log('\n📁 Contents of dist/ directory:');
if (fs.existsSync('dist')) {
  const distContents = fs.readdirSync('dist', { recursive: true });
  distContents.forEach(item => {
    const stats = fs.statSync(path.join('dist', item));
    const type = stats.isDirectory() ? '📁' : '📄';
    console.log(`  ${type} ${item}`);
  });
}

console.log('\n✅ Build script completed!');
if (allFilesExist && allManifestsExist) {
  console.log('🎯 Extension is ready for testing!');
  console.log('📋 To load in Firefox: about:debugging > This Firefox > Load Temporary Add-on > select manifest-firefox.json');
  console.log('📋 To load in Chrome: chrome://extensions > Developer mode > Load unpacked > select dist/ folder');
} else {
  console.log('⚠️  Please check the warnings above and fix the build issues.');
} 