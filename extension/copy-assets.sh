#!/bin/bash
# Copy static assets to dist folder after build

echo "📁 Copying static assets to dist folder..."

# Copy CSS files
cp design-system.css dist/
cp overlay.css dist/

# Copy HTML files
cp popup.html dist/

echo "✅ Static assets copied successfully!"
echo "📁 Dist folder contents:"
ls -la dist/ 