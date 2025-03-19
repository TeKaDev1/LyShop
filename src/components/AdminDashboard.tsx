
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getProducts, getOrders, getCategories, Product, Order, Category } from '@/lib/data';

// Import refactored components
import Sidebar from './admin/Sidebar';
import OverviewTab from './admin/OverviewTab';
import ProductsTab from './admin/ProductsTab';
import CategoriesTab from './admin/CategoriesTab';
import OrdersTab from './admin/OrdersTab';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  const refreshData = async () => {
    try {
      // Initialize data to ensure we have products, orders, and categories
      try {
        // Initialize data from localStorage or defaults
        const { initializeData } = await import('@/lib/data');
        initializeData();
      } catch (initError) {
        console.error('Error initializing data:', initError);
      }
      
      setProducts(getProducts());
      setOrders(getOrders());
      setCategories(getCategories());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewTab products={products} orders={orders} />
            </motion.div>
          )}
          
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductsTab 
                products={products} 
                categories={categories} 
                refreshProducts={() => setProducts(getProducts())} 
              />
            </motion.div>
          )}
          
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoriesTab 
                categories={categories} 
                products={products}
                refreshCategories={() => {
                  setCategories(getCategories());
                  // Also refresh products since they might reference categories
                  setProducts(getProducts());
                }} 
              />
            </motion.div>
          )}
          
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OrdersTab
                orders={orders}
                refreshOrders={() => setOrders(getOrders())}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
