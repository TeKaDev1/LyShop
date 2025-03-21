// This file is loaded first to ensure polyfills are available
// before any other code runs

// Ensure slice method is available on all objects
if (typeof Object !== 'undefined' && !Object.prototype.hasOwnProperty('slice')) {
  Object.defineProperty(Object.prototype, 'slice', {
    value: function(start, end) {
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

// Ensure Array.from handles objects without slice method
if (typeof Array !== 'undefined' && Array.from) {
  const originalArrayFrom = Array.from;
  Array.from = function(...args) {
    const result = originalArrayFrom.apply(this, args);
    return result;
  };
}

// Ensure JSON.parse handles objects without slice method
if (typeof JSON !== 'undefined' && JSON.parse) {
  const originalJSONParse = JSON.parse;
  JSON.parse = function(...args) {
    const result = originalJSONParse.apply(this, args);
    return result;
  };
}

console.log('Polyfills loaded successfully');