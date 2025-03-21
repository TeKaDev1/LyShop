import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getProducts, getOrders, getCategories } from '@/lib/data';
import { subscribeToProducts, subscribeToOrders, subscribeToDeliveryZones } from '@/lib/firebase';
import { Product, Order, Category, DeliveryZone } from '@/types';

// Import refactored components
import Sidebar from './admin/Sidebar';
import OverviewTab from './admin/OverviewTab';
import ProductsTab from './admin/ProductsTab';
import CategoriesTab from './admin/CategoriesTab';
import OrdersTab from './admin/OrdersTab';
import DeliveryZonesTab from './admin/DeliveryZonesTab';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    // الاشتراك في تحديثات المنتجات
    const unsubscribeProducts = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    // الاشتراك في تحديثات الطلبات
    const unsubscribeOrders = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });

    // الاشتراك في تحديثات مناطق التوصيل
    const unsubscribeDeliveryZones = subscribeToDeliveryZones((updatedZones) => {
      setDeliveryZones(updatedZones);
    });

    // تحميل التصنيفات
    const loadCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();

    // إلغاء الاشتراك عند تفكيك المكون
    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeDeliveryZones();
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  const refreshProducts = async () => {
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  const refreshCategories = async () => {
    const updatedCategories = await getCategories();
    setCategories(updatedCategories);
  };

  const refreshOrders = async () => {
    const updatedOrders = await getOrders();
    setOrders(updatedOrders);
  };

  const refreshDeliveryZones = async () => {
    // سيتم تحديث مناطق التوصيل تلقائياً من خلال الاشتراك
  };

  const calculateTotal = () => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        tabs={[
          { id: 'overview', label: 'نظرة عامة' },
          { id: 'products', label: 'المنتجات' },
          { id: 'categories', label: 'التصنيفات' },
          { id: 'orders', label: 'الطلبات' },
          { id: 'delivery', label: 'مناطق التوصيل' }
        ]}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
        <div className="container mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab key="overview" products={products} orders={orders} />
            )}
            {activeTab === 'products' && (
              <ProductsTab 
                key="products" 
                products={products} 
                categories={categories} 
                refreshProducts={refreshProducts}
              />
            )}
            {activeTab === 'categories' && (
              <CategoriesTab 
                key="categories" 
                categories={categories} 
                products={products}
                refreshCategories={refreshCategories}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab 
                key="orders" 
                orders={orders}
                refreshOrders={refreshOrders}
              />
            )}
            {activeTab === 'delivery' && (
              <DeliveryZonesTab
                key="delivery"
                zones={deliveryZones}
                refreshZones={refreshDeliveryZones}
              />
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">الإجمالي:</span>
            <span className="text-xl font-bold text-primary">{calculateTotal().toFixed(2)} د.ل</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
