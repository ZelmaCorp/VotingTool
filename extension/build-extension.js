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
const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenGov VotingTool</title>
    <link rel="stylesheet" href="App.css">
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
    <script type="module" src="popup.js"></script>
</body>
</html>`;

fs.writeFileSync(popupHtmlPath, popupHtml);
console.log('Created popup.html in dist/');

console.log('Extension build completed successfully!');
console.log('Files in dist/:', fs.readdirSync('dist').join(', ')); 