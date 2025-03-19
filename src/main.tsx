import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeData } from './lib/data'

// Initialize data asynchronously to improve initial load time
setTimeout(() => {
  initializeData();
}, 0);

createRoot(document.getElementById("root")!).render(<App />);
