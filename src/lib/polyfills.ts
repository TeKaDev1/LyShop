import { Buffer } from 'buffer';

// Add type declaration for window
declare global {
  interface Window {
    Buffer: typeof Buffer;
    _safeSlice: (obj: any, start: number, end?: number) => any;
  }
}

// Safer polyfill implementation that doesn't modify Object.prototype
(function() {
  if (typeof window === 'undefined') return;

  // Add Buffer to window
  window.Buffer = Buffer;

  // Create a utility function for slicing any object without modifying prototypes
  window._safeSlice = function(obj: any, start: number, end?: number): any {
    if (!obj) return obj;
    
    // If it already has a slice method, use it
    if (typeof obj.slice === 'function') {
      return obj.slice(start, end);
    }
    
    // Handle array-like objects
    if (typeof obj.length === 'number') {
      try {
        const arr = Array.prototype.slice.call(obj, 0);
        return arr.slice(start, end);
      } catch (e) {
        console.warn('Failed to slice array-like object:', e);
      }
    }
    
    // Handle string-like objects
    if (obj.toString && typeof obj.toString === 'function') {
      try {
        const str = obj.toString();
        if (typeof str.slice === 'function') {
          return str.slice(start, end);
        }
      } catch (e) {
        console.warn('Failed to slice string-like object:', e);
      }
    }
    
    // Last resort: try to convert to array
    try {
      const arr = Array.from(obj);
      return arr.slice(start, end);
    } catch (e) {
      console.warn('Failed to convert to array for slicing:', e);
      return obj; // Return original if all else fails
    }
  };

  // Patch JSON.parse more safely
  try {
    const originalJSONParse = JSON.parse;
    JSON.parse = function(...args) {
      try {
        return originalJSONParse.apply(this, args);
      } catch (e) {
        console.warn('JSON.parse error:', e);
        throw e; // Re-throw to maintain expected behavior
      }
    };
  } catch (e) {
    console.warn('Failed to patch JSON.parse:', e);
  }

  // Patch Array.from more safely
  try {
    if (Array.from) {
      const originalArrayFrom = Array.from;
      Array.from = function(...args) {
        try {
          return originalArrayFrom.apply(this, args);
        } catch (e) {
          console.warn('Array.from error:', e);
          return args[0] || []; // Return original or empty array
        }
      };
    }
  } catch (e) {
    console.warn('Failed to patch Array.from:', e);
  }

  console.log('Safe polyfills applied successfully');
})();

export {};