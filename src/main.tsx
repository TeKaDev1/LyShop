// Import React first to ensure it's available before anything else
import React from 'react';
import { createRoot } from 'react-dom/client';

// Then import polyfills
import './lib/polyfills';

// Import app components
import App from './App.tsx';
import './index.css';
import { initializeData } from './lib/data';

// Initialize data asynchronously to improve initial load time
const init = async () => {
  try {
    await initializeData();
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
};

// Make sure DOM is ready before rendering
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  try {
    init();
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Failed to render React app:', error);
  }
});
