import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  
  // Ensure String.prototype.slice is available
  if (!String.prototype.slice) {
    String.prototype.slice = function(start: number, end?: number): string {
      return this.substring(start, end);
    };
  }
  
  // Ensure Array.prototype.slice is available
  if (!Array.prototype.slice) {
    Array.prototype.slice = function(start: number, end?: number): any[] {
      const result = [];
      const len = this.length;
      let startIndex = start >= 0 ? start : Math.max(len + start, 0);
      let endIndex = end !== undefined ? (end >= 0 ? Math.min(end, len) : len + end) : len;
      
      for (let i = startIndex; i < endIndex; i++) {
        result.push(this[i]);
      }
      
      return result;
    };
  }
  
  // Ensure that any object that might be used with slice has the method
  const ensureSliceMethod = (obj: any) => {
    if (obj && typeof obj === 'object' && !obj.slice) {
      obj.slice = function(start: number, end?: number): any[] {
        // Convert to array and use array slice
        const arr = Array.from(this);
        return arr.slice(start, end);
      };
    }
    return obj;
  };
  
  // Patch global fetch to ensure returned data has slice method
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function(...args) {
      return originalFetch.apply(this, args).then((response) => {
        // Ensure response and its methods have slice
        ensureSliceMethod(response);
        const originalJson = response.json;
        if (originalJson) {
          response.json = function() {
            return originalJson.apply(this).then(ensureSliceMethod);
          };
        }
        return response;
      });
    };
  }
}

export {};