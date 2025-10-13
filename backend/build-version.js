const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

// Create version file
const versionInfo = {
    version: packageJson.version,
    buildDate: new Date().toISOString(),
    buildNumber: process.env.BUILD_NUMBER || 'dev'
};

// Ensure dist/src directory exists
const distDir = path.join(__dirname, 'dist', 'src');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Write version info to file
fs.writeFileSync(
    path.join(distDir, 'version.json'),
    JSON.stringify(versionInfo, null, 2)
);

console.log('Version file created:', versionInfo);