// Import polyfills first to ensure they're loaded before any other code
import '../src/polyfill-loader.js'
import './lib/polyfills'

// Ensure global objects have slice method
if (typeof Object !== 'undefined' && !Object.prototype.hasOwnProperty('slice')) {
  Object.defineProperty(Object.prototype, 'slice', {
    value: function(start: number, end?: number) {
      if (Array.isArray(this)) {
        return Array.prototype.slice.call(this, start, end);
      }
      if (typeof this === 'string') {
        return String.prototype.slice.call(this, start, end);
      }
      const arr = Array.from(this || []);
      return arr.slice(start, end);
    },
    writable: true,
    configurable: true
  });
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeData } from './lib/data'

// Initialize data asynchronously to improve initial load time
const init = async () => {
  try {
    await initializeData();
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
};

init();

createRoot(document.getElementById("root")!).render(<App />);
