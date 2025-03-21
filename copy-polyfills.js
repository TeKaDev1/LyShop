// Enhanced script to copy necessary files to the dist directory
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create src directory in dist if it doesn't exist
if (!fs.existsSync('dist/src')) {
  fs.mkdirSync('dist/src');
}

// Create src/lib directory in dist if it doesn't exist
if (!fs.existsSync('dist/src/lib')) {
  fs.mkdirSync('dist/src/lib');
}

// Copy polyfill-loader.js to dist root
fs.copyFileSync(
  path.join(__dirname, 'src', 'polyfill-loader.js'),
  path.join(__dirname, 'dist', 'polyfill-loader.js')
);
console.log('Copied polyfill-loader.js to dist root');

// Copy polyfills.ts to dist/src/lib
fs.copyFileSync(
  path.join(__dirname, 'src', 'lib', 'polyfills.ts'),
  path.join(__dirname, 'dist', 'src', 'lib', 'polyfills.ts')
);
console.log('Copied polyfills.ts to dist/src/lib');

// We no longer need to copy manifest.json from root as it's already in public
// and will be copied by Vite automatically
console.log('Using manifest.json from public directory');

// Copy favicon files to dist
if (fs.existsSync(path.join(__dirname, 'favicon.ico'))) {
  fs.copyFileSync(
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, 'dist', 'favicon.ico')
  );
  console.log('Copied favicon.ico to dist');
}

if (fs.existsSync(path.join(__dirname, 'favicon.svg'))) {
  fs.copyFileSync(
    path.join(__dirname, 'favicon.svg'),
    path.join(__dirname, 'dist', 'favicon.svg')
  );
  console.log('Copied favicon.svg to dist');
}

// Copy from public directory if it exists
if (fs.existsSync(path.join(__dirname, 'public'))) {
  const publicFiles = fs.readdirSync(path.join(__dirname, 'public'));
  
  for (const file of publicFiles) {
    const sourcePath = path.join(__dirname, 'public', file);
    const destPath = path.join(__dirname, 'dist', file);
    
    // Skip directories for simplicity
    if (fs.statSync(sourcePath).isDirectory()) continue;
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} from public to dist`);
  }
}

console.log('All files copied successfully');