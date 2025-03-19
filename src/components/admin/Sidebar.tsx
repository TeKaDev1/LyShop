
import React from 'react';
import { BarChart, Package, ShoppingBag, LogOut, Tags } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="md:w-64 bg-white dark:bg-gray-900 shadow-sm p-4 md:p-6">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-xl font-bold dark:text-white">لوحة الإدارة</h1>
        </div>
        
        <nav className="flex-grow">
          <ul className="space-y-1">
            <li>
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart size={18} className="ml-2" />
                <span className="dark:text-gray-200">نظرة عامة</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === 'products'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('products')}
              >
                <Package size={18} className="ml-2" />
                <span className="dark:text-gray-200">المنتجات</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('categories')}
              >
                <Tags size={18} className="ml-2" />
                <span className="dark:text-gray-200">الفئات</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={18} className="ml-2" />
                <span className="dark:text-gray-200">الطلبات</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="pt-4 border-t dark:border-gray-700">
          <button
            className="flex items-center w-full p-3 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={onLogout}
          >
            <LogOut size={18} className="ml-2" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
