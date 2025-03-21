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
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      crypto: 'crypto-browserify',
    },
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate sourcemaps for better debugging
    sourcemap: mode === 'development',
    // Ensure assets are correctly referenced
    assetsDir: 'assets',
    // Configure rollup options
    rollupOptions: {
      output: {
        // Ensure large chunks are split appropriately
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  base: '/',
  preview: {
    port: 8080,
    historyApiFallback: true,
  }
}));
