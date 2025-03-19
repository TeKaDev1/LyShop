import React, { createContext, useContext, useState, useEffect } from 'react';

type DarkModeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always default to light mode when the app first loads
  const [darkMode, setDarkMode] = useState(false);

  // Initialize with light mode and clear any previous preference
  useEffect(() => {
    // Remove dark class from document to ensure light mode
    document.documentElement.classList.remove('dark');
    
    // Clear any previous dark mode preference
    localStorage.removeItem('darkMode');
  }, []);

  // Update localStorage when darkMode changes (after initial load)
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    
    // Apply or remove dark class from document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // We're no longer listening for system preference changes since we're defaulting to light mode
  // This effect is kept commented for reference in case we want to revert this behavior
  /*
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  */

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};