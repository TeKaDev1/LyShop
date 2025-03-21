// This file is loaded first to ensure polyfills are available
// before any other code runs

// Safely apply polyfills without modifying Object.prototype directly
(function() {
  // Create a safer version of the slice polyfill that doesn't modify Object.prototype
  window._slicePolyfill = function(obj, start, end) {
    if (!obj) return obj;
    
    if (Array.isArray(obj)) {
      return Array.prototype.slice.call(obj, start, end);
    }
    if (typeof obj === 'string') {
      return String.prototype.slice.call(obj, start, end);
    }
    try {
      const arr = Array.from(obj || []);
      return arr.slice(start, end);
    } catch (e) {
      console.warn('Slice polyfill failed:', e);
      return obj;
    }
  };

  // Safer version that doesn't interfere with React
  if (typeof Array !== 'undefined' && Array.from) {
    const originalArrayFrom = Array.from;
    Array.from = function(...args) {
      try {
        return originalArrayFrom.apply(this, args);
      } catch (e) {
        console.warn('Array.from polyfill failed:', e);
        return args[0] || [];
      }
    };
  }

  // Safer version that doesn't interfere with React
  if (typeof JSON !== 'undefined' && JSON.parse) {
    const originalJSONParse = JSON.parse;
    JSON.parse = function(...args) {
      try {
        return originalJSONParse.apply(this, args);
      } catch (e) {
        console.warn('JSON.parse polyfill failed:', e);
        throw e; // Re-throw to maintain expected behavior
      }
    };
  }

  console.log('Polyfills loaded successfully');
})();