import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/lib/darkModeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  }, [location]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/user-dashboard');
    } else {
      navigate('/user-account');
    }
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المنتجات', path: '/products' },
    {
      name: isLoggedIn ? 'حسابي' : 'تسجيل الدخول',
      onClick: handleAccountClick
    },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">ليبيا-شوبر</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            {navLinks.map((link, index) => (
              link.onClick ? (
                <button
                  key={index}
                  onClick={link.onClick}
                  className={cn(
                    "px-4 py-2 rounded-full mx-2 text-sm font-medium transition-all-medium",
                    (isLoggedIn && location.pathname === '/user-dashboard') ||
                    (!isLoggedIn && location.pathname === '/user-account')
                      ? "bg-primary text-white"
                      : "hover:bg-primary/10"
                  )}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full mx-2 text-sm font-medium transition-all-medium",
                    location.pathname === link.path
                      ? "bg-primary text-white"
                      : "hover:bg-primary/10"
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 mr-2 rounded-full hover:bg-muted transition-all-medium"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link
              to="/admin"
              className="p-2 mr-2 rounded-full hover:bg-muted transition-all-medium dark:hover:bg-gray-700"
              aria-label="Admin Dashboard"
            >
              <User size={20} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-muted transition-all"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md dark:text-white"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link, index) => (
                  link.onClick ? (
                    <button
                      key={index}
                      onClick={link.onClick}
                      className={cn(
                        "px-4 py-3 rounded-lg transition-all-medium text-right w-full",
                        (isLoggedIn && location.pathname === '/user-dashboard') ||
                        (!isLoggedIn && location.pathname === '/user-account')
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      )}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "px-4 py-3 rounded-lg transition-all-medium",
                        location.pathname === link.path
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      )}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="px-4 py-3 rounded-lg flex items-center hover:bg-muted transition-all-medium dark:hover:bg-gray-700 w-full text-right"
                >
                  {darkMode ? <Sun size={18} className="ml-2" /> : <Moon size={18} className="ml-2" />}
                  <span>{darkMode ? "الوضع النهاري" : "الوضع الليلي"}</span>
                </button>
                
                <Link
                  to="/admin"
                  className="px-4 py-3 rounded-lg flex items-center hover:bg-muted transition-all-medium dark:hover:bg-gray-700"
                >
                  <User size={18} className="ml-2" />
                  <span>لوحة الإدارة</span>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
