import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Phone, Package } from 'lucide-react';
import { getOrders } from '@/lib/data';

const UserLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate phone number and order ID
    if (!phone.trim() || !orderId.trim()) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "الرجاء إدخال رقم الهاتف ورقم الطلب",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Get all orders
    const orders = getOrders();
    
    // Find the order that matches both phone and order ID
    const matchingOrder = orders.find(
      order => order.phone.replace(/\D/g, '').includes(phone.replace(/\D/g, '')) &&
              order.id === orderId
    );
    
    // Find all orders with the same phone number
    const userOrders = orders.filter(
      order => order.phone.replace(/\D/g, '').includes(phone.replace(/\D/g, ''))
    );
    
    setTimeout(() => {
      if (matchingOrder) {
        // Store user info in session storage
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userPhone', matchingOrder.phone);
        sessionStorage.setItem('userName', matchingOrder.customerName);
        
        // Store the current order ID but don't limit the dashboard to only show this order
        // The UserDashboard component will show all orders with the same phone number
        sessionStorage.setItem('userId', matchingOrder.id);
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: userOrders.length > 1
            ? `تم العثور على ${userOrders.length} طلبات مرتبطة برقم هاتفك`
            : "جاري تحويلك إلى لوحة التحكم...",
          variant: "default",
        });
        
        // Navigate to user dashboard using React Router
        setTimeout(() => {
          // Redirect to homepage instead of user-dashboard if there's an issue
          try {
            navigate('/user-account');
          } catch (error) {
            console.error('Navigation error:', error);
            navigate('/');
            toast({
              title: "تم تسجيل الدخول بنجاح",
              description: "مرحباً بك في متجر ليبيا شوبر",
              variant: "default",
            });
          }
        }, 1000);
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "رقم الهاتف أو رقم الطلب غير صحيح",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2 dark:text-white">متابعة الطلب</h1>
            <p className="text-muted-foreground dark:text-gray-300">قم بتسجيل الدخول لمتابعة حالة طلبك والحصول على توصيات مخصصة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 dark:text-gray-200">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pl-3 pr-3 pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 0912345678"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="orderId" className="block text-sm font-medium mb-2 dark:text-gray-200">
                رقم الطلب
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pl-3 pr-3 pointer-events-none text-gray-400">
                  <Package size={18} />
                </div>
                <input
                  id="orderId"
                  type="text"
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="مثال: 1001"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;