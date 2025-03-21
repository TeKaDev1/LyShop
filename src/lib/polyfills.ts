import { Buffer } from 'buffer';

// Add type declaration for window
declare global {
  interface Window {
    Buffer: typeof Buffer;
    slicePolyfill: (obj: any) => any;
  }
}

// Global polyfill for slice method
function globalPolyfill() {
  if (typeof window === 'undefined') return;

  // Add Buffer to window
  window.Buffer = Buffer;

  // Global slice polyfill that works with any object
  window.slicePolyfill = function(obj: any) {
    if (!obj) return obj;
    
    // If it's already sliceable, return it
    if (typeof obj.slice === 'function') return obj;
    
    // Add slice method to the object
    Object.defineProperty(obj, 'slice', {
      value: function(start: number, end?: number) {
        // If it's array-like, convert to array and slice
        if (typeof this.length === 'number') {
          const arr = Array.prototype.slice.call(this, 0);
          return arr.slice(start, end);
        }
        
        // If it's string-like, convert to string and slice
        if (this.toString && typeof this.toString === 'function') {
          const str = this.toString();
          return str.slice(start, end);
        }
        
        // Default fallback
        return Array.from(this).slice(start, end);
      },
      writable: true,
      configurable: true
    });
    
    return obj;
  };

  // Patch Object prototype (dangerous but effective)
  if (!Object.prototype.hasOwnProperty('slice')) {
    Object.defineProperty(Object.prototype, 'slice', {
      value: function(start: number, end?: number) {
        return window.slicePolyfill(this).slice(start, end);
      },
      writable: true,
      configurable: true
    });
  }

  // Patch global fetch
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function(...args) {
      return originalFetch.apply(this, args).then((response) => {
        window.slicePolyfill(response);
        const originalJson = response.json;
        if (originalJson) {
          response.json = function() {
            return originalJson.apply(this).then(window.slicePolyfill);
          };
        }
        return response;
      });
    };
  }

  // Patch JSON.parse
  const originalJSONParse = JSON.parse;
  JSON.parse = function(...args) {
    const result = originalJSONParse.apply(this, args);
    return window.slicePolyfill(result);
  };

  // Patch Array.from
  const originalArrayFrom = Array.from;
  Array.from = function(...args) {
    const result = originalArrayFrom.apply(this, args);
    return window.slicePolyfill(result);
  };

  console.log('Global polyfills applied successfully');
}

// Apply polyfills immediately
globalPolyfill();

export {};