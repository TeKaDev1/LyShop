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
