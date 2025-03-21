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
      // Ensure React is properly initialized
      jsxImportSource: 'react',
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
      // Add React aliases to ensure consistent versions
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    include: [
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'react',
      'react-dom',
      'react-router-dom',
    ],
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
    sourcemap: true,
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
        // Add a safer intro that doesn't modify Object.prototype
        intro: `
          // Create a safe slice utility without modifying Object.prototype
          window._safeSlice = function(obj, start, end) {
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
              console.warn('Slice helper failed:', e);
              return obj;
            }
          };
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
