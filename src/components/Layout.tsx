import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      "transition-colors duration-300",
      "dark:bg-gray-900 dark:text-white"
    )}>
      <Navbar />
      <motion.main
        className="flex-grow dark:bg-gray-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Layout;
