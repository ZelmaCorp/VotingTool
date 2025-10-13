const fs = require('fs');
const path = require('path');

try {
    // Try to read version.json
    const versionPath = path.join(__dirname, 'dist', 'src', 'version.json');
    const versionInfo = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    
    // Read package.json
    const packageJson = require('./package.json');
    
    // Compare versions
    if (versionInfo.version !== packageJson.version) {
        console.error('Version mismatch:');
        console.error('  package.json:', packageJson.version);
        console.error('  version.json:', versionInfo.version);
        process.exit(1);
    }
    
    console.log('Version check passed:', packageJson.version);
    process.exit(0);
} catch (error) {
    console.error('Failed to check version:', error.message);
    process.exit(1);
}