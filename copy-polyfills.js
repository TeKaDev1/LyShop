// Simple script to copy polyfill-loader.js to the dist directory
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create src directory in dist if it doesn't exist
if (!fs.existsSync('dist/src')) {
  fs.mkdirSync('dist/src');
}

// Copy polyfill-loader.js to dist/src
fs.copyFileSync(
  path.join(__dirname, 'src', 'polyfill-loader.js'),
  path.join(__dirname, 'dist', 'src', 'polyfill-loader.js')
);

console.log('Copied polyfill-loader.js to dist/src');

// Copy manifest.json to dist
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(__dirname, 'dist', 'manifest.json')
);

console.log('Copied manifest.json to dist');