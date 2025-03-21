import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    react({
      // Add this to ensure proper handling of polyfills
      jsxImportSource: "@emotion/react",
      plugins: [["@swc/plugin-emotion", {}]],
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    include: ['buffer', 'crypto-browserify', 'stream-browserify'],
  },
  define: {
    // Fix for process is not defined
    'process.env': {},
    'global': 'window',
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate sourcemaps for better debugging
    sourcemap: true, // Always generate sourcemaps for easier debugging
    // Ensure assets are correctly referenced
    assetsDir: 'assets',
    // Configure rollup options
    target: 'es2020',
    rollupOptions: {
      output: {
        // Ensure large chunks are split appropriately
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('buffer') || id.includes('crypto') || id.includes('stream')) {
              return 'vendor-polyfills';
            }
            return 'vendor';
          }
        },
        // Ensure proper format
        format: 'es',
        // Add intro to inject polyfills at the beginning of each chunk
        intro: `
          // Ensure slice method is available on all objects
          if (!Object.prototype.hasOwnProperty('slice')) {
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
        `
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  base: '/',
  preview: {
    port: 8080,
    historyApiFallback: true,
  }
}));
