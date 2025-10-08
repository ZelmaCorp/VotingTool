#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Backend Version Injection Script
 * 
 * This script reads the version from package.json and injects it into
 * the compiled JavaScript files, ensuring version consistency across the backend.
 */

console.log('🔧 Backend Version Injection Script');
console.log('=====================================');

// Read version from package.json (single source of truth)
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const APP_VERSION = packageJson.version;

console.log(`📦 Using version ${APP_VERSION} from package.json`);

// Files to inject version into (after compilation)
const filesToUpdate = [
  'dist/src/app.js',
  'dist/src/config/logger.js',
  'dist/src/refresh.js'
];

// Create dist directory if it doesn't exist
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log(`📁 Created ${distDir} directory`);
}

// Function to inject version into a file
function injectVersionIntoFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath} (will be created after compilation)`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace fallback version with actual version
    const versionRegex = /let APP_VERSION = "[\d\.]+-fallback";/g;
    const newVersionLine = `let APP_VERSION = "${APP_VERSION}";`;
    
    if (content.match(versionRegex)) {
      content = content.replace(versionRegex, newVersionLine);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Updated version in ${filePath}`);
    } else {
      // Also try to replace any existing version
      const anyVersionRegex = /let APP_VERSION = "[^"]+";/g;
      if (content.match(anyVersionRegex)) {
        content = content.replace(anyVersionRegex, newVersionLine);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Updated existing version in ${filePath}`);
      } else {
        console.log(`ℹ️  No version placeholder found in ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all target files
filesToUpdate.forEach(file => {
  injectVersionIntoFile(file);
});

console.log('🎯 Backend version injection completed!');
console.log(`📋 Version ${APP_VERSION} has been injected into compiled files.`);
console.log('');
console.log('💡 Usage:');
console.log('  npm run build        - Build with version injection');
console.log('  npm run version:patch - Increment patch version and build');
console.log('  npm run version:minor - Increment minor version and build');
console.log('  npm run version:major - Increment major version and build');
console.log('  npm run version:check - Validate version consistency');
