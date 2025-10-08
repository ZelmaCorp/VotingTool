#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Backend Version Consistency Checker
 * 
 * This script validates that the version is consistent across all backend files
 * and that the build process has properly injected the version.
 */

console.log('🔍 Backend Version Consistency Check');
console.log('=====================================');

// Read version from package.json (single source of truth)
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const expectedVersion = packageJson.version;

console.log(`📦 Expected version from package.json: ${expectedVersion}`);

// Files to check for version consistency
const filesToCheck = [
  {
    path: 'dist/src/app.js',
    description: 'Main application file',
    required: false // Will be created after build
  },
  {
    path: 'dist/src/config/logger.js',
    description: 'Logger configuration',
    required: false
  },
  {
    path: 'dist/src/refresh.js',
    description: 'Refresh service',
    required: false
  }
];

// Source files to check for fallback version
const sourceFilesToCheck = [
  {
    path: 'src/app.ts',
    description: 'Main application source',
    required: true
  },
  {
    path: 'src/config/logger.ts',
    description: 'Logger configuration source',
    required: true
  },
  {
    path: 'src/refresh.ts',
    description: 'Refresh service source',
    required: true
  }
];

let allConsistent = true;

// Check compiled files
console.log('\n📋 Checking compiled files:');
filesToCheck.forEach(file => {
  if (!fs.existsSync(file.path)) {
    console.log(`⚠️  ${file.description}: Not found (${file.path}) - Run 'npm run build' first`);
    return;
  }

  try {
    const content = fs.readFileSync(file.path, 'utf-8');
    const versionMatch = content.match(/let APP_VERSION = "([^"]+)";/);
    
    if (versionMatch) {
      const foundVersion = versionMatch[1];
      if (foundVersion === expectedVersion) {
        console.log(`✅ ${file.description}: Version ${foundVersion} ✓`);
      } else {
        console.log(`❌ ${file.description}: Version ${foundVersion} (expected ${expectedVersion})`);
        allConsistent = false;
      }
    } else {
      console.log(`⚠️  ${file.description}: No version found`);
      allConsistent = false;
    }
  } catch (error) {
    console.log(`❌ ${file.description}: Error reading file - ${error.message}`);
    allConsistent = false;
  }
});

// Check source files for fallback version
console.log('\n📋 Checking source files:');
sourceFilesToCheck.forEach(file => {
  if (!fs.existsSync(file.path)) {
    console.log(`❌ ${file.description}: Not found (${file.path})`);
    allConsistent = false;
    return;
  }

  try {
    const content = fs.readFileSync(file.path, 'utf-8');
    const fallbackMatch = content.match(/let APP_VERSION = "([^"]+)-fallback";/);
    
    if (fallbackMatch) {
      const fallbackVersion = fallbackMatch[1];
      if (fallbackVersion === expectedVersion) {
        console.log(`✅ ${file.description}: Fallback version ${fallbackVersion} ✓`);
      } else {
        console.log(`❌ ${file.description}: Fallback version ${fallbackVersion} (expected ${expectedVersion})`);
        allConsistent = false;
      }
    } else {
      console.log(`⚠️  ${file.description}: No fallback version found`);
      allConsistent = false;
    }
  } catch (error) {
    console.log(`❌ ${file.description}: Error reading file - ${error.message}`);
    allConsistent = false;
  }
});

// Summary
console.log('\n📊 Summary:');
if (allConsistent) {
  console.log('✅ All version checks passed! Backend version is consistent.');
  console.log(`🎯 Current version: ${expectedVersion}`);
} else {
  console.log('❌ Version inconsistencies found!');
  console.log('💡 To fix:');
  console.log('   1. Update package.json version if needed');
  console.log('   2. Run: npm run build');
  console.log('   3. Run: npm run version:check');
  process.exit(1);
}

console.log('\n💡 Usage:');
console.log('  npm run version:check    - Check version consistency');
console.log('  npm run build           - Build with version injection');
console.log('  npm run version:patch   - Increment patch version and build');
console.log('  npm run version:minor   - Increment minor version and build');
console.log('  npm run version:major   - Increment major version and build');
