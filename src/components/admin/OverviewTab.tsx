
import React from 'react';
import { Package, DollarSign, ShoppingBag } from 'lucide-react';
import { Product, Order } from '@/lib/data';

interface OverviewTabProps {
  products: Product[];
  orders: Order[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ products, orders }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">نظرة عامة</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-300 ml-4">
              <Package size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm dark:text-gray-300">إجمالي المنتجات</p>
              <p className="text-2xl font-bold dark:text-white">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900 text-green-500 dark:text-green-300 ml-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm dark:text-gray-300">إجمالي المبيعات</p>
              <p className="text-2xl font-bold dark:text-white">{totalRevenue.toFixed(2)} د.ل</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900 text-amber-500 dark:text-amber-300 ml-4">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm dark:text-gray-300">الطلبات المعلقة</p>
              <p className="text-2xl font-bold dark:text-white">{pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 dark:text-white">أحدث الطلبات</h3>
        
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-right py-3 px-4 dark:text-gray-200">رقم الطلب</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">العميل</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">الحالة</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">المبلغ</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 dark:text-gray-200">{order.id}</td>
                    <td className="py-3 px-4 dark:text-gray-200">{order.customerName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {order.status === 'pending' ? 'معلق' : 
                        order.status === 'processing' ? 'قيد المعالجة' :
                        order.status === 'shipped' ? 'تم الشحن' : 'تم التسليم'}
                      </span>
                    </td>
                    <td className="py-3 px-4 dark:text-gray-200">{order.totalPrice.toFixed(2)} د.ل</td>
                    <td className="py-3 px-4 dark:text-gray-200">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 dark:text-gray-300">لا توجد طلبات حالياً</p>
        )}
      </div>
    </>
  );
};

export default OverviewTab;
