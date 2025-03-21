import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getProducts, Product, Order, addToWishlist, removeFromWishlist, getWishlist } from '@/lib/data';
import { subscribeToOrders, subscribeToProducts } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Package, ShoppingBag, LogOut, Heart, Plus, X } from 'lucide-react';
import ProductCard from './ProductCard';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number>(0);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [showWishlistInput, setShowWishlistInput] = useState<boolean>(false);
  const [productIdInput, setProductIdInput] = useState<string>('');
  const userPhone = sessionStorage.getItem('userPhone');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn || !userPhone) {
      navigate('/user-login');
      return;
    }

    // الاشتراك في تحديثات الطلبات
    const unsubscribeOrders = subscribeToOrders((allOrders) => {
      // تصفية الطلبات الخاصة بالمستخدم الحالي
      const userSpecificOrders = allOrders.filter(order => 
        order.phone.replace(/\D/g, '').includes(userPhone.replace(/\D/g, ''))
      );
      setUserOrders(userSpecificOrders);
    });

    // الاشتراك في تحديثات المنتجات
    const unsubscribeProducts = subscribeToProducts((products) => {
      // تحديث المنتجات الموصى بها
      if (userOrders.length > 0) {
        const orderedProductIds = userOrders.flatMap(order =>
          order.products.map(p => p.productId)
        );

        const orderedProducts = products.filter(p =>
          orderedProductIds.includes(p.id)
        );

        const orderedCategories = orderedProducts.map(p => p.category);
        const recommendations = products.filter(p =>
          orderedCategories.includes(p.category) &&
          !orderedProductIds.includes(p.id)
        );

        setRecommendedProducts(recommendations.slice(0, 4));
      }
    });

    // تحميل قائمة المفضلة
    const loadWishlist = async () => {
      if (userPhone) {
        try {
          const wishlistIds = await getWishlist(userPhone);
          const allProducts = await getProducts();
          const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));
          setWishlist(wishlistProducts);
        } catch (error) {
          console.error('Error loading wishlist:', error);
        }
      }
    };
    loadWishlist();

    setUserName(sessionStorage.getItem('userName') || 'العميل');
    setLoading(false);

    // تنظيف الاشتراكات عند تفكيك المكون
    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, [navigate, userPhone]);

  const handleAddToWishlist = async (productId: string) => {
    if (!userPhone) return;
    
    try {
      await addToWishlist(userPhone, productId);
      const wishlistIds = await getWishlist(userPhone);
      const allProducts = await getProducts();
      const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));
      setWishlist(wishlistProducts);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تمت إضافة المنتج إلى قائمة المفضلة",
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في إضافة المنتج إلى قائمة المفضلة",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!userPhone) return;
    
    try {
      await removeFromWishlist(userPhone, productId);
      const wishlistIds = await getWishlist(userPhone);
      const allProducts = await getProducts();
      const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));
      setWishlist(wishlistProducts);
      
      toast({
        title: "تمت الإزالة بنجاح",
        description: "تمت إزالة المنتج من قائمة المفضلة",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في إزالة المنتج من قائمة المفضلة",
        variant: "destructive",
      });
    }
  };

  // Function to get status label in Arabic
  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'suspended': return 'موقوف';
      default: return status;
    }
  };

  // Function to get status color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">مرحباً {userName}</h1>
        <div className="flex space-x-4 space-x-reverse">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowRight size={18} className="ml-2" />
            <span>العودة للمتجر</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('userLoggedIn');
              sessionStorage.removeItem('userPhone');
              sessionStorage.removeItem('userName');
              sessionStorage.removeItem('userId');
              navigate('/');
            }}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <LogOut size={18} className="ml-2" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {userOrders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Package className="ml-2 text-primary" size={24} />
                  <h2 className="text-xl font-bold dark:text-white">تفاصيل الطلب</h2>
                </div>
                
                {userOrders.length > 1 && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 ml-2">اختر الطلب:</span>
                    <select
                      value={selectedOrderIndex}
                      onChange={(e) => setSelectedOrderIndex(Number(e.target.value))}
                      className="p-1 border border-gray-200 rounded dark:bg-white dark:text-gray-900"
                    >
                      {userOrders.map((order, index) => (
                        <option key={order.id} value={index}>
                          طلب #{order.id} - {order.date}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium dark:text-gray-200">رقم الطلب:</span>
                  <span className="dark:text-gray-200">#{userOrders[selectedOrderIndex].id}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium dark:text-gray-200">تاريخ الطلب:</span>
                  <span className="dark:text-gray-200">{userOrders[selectedOrderIndex].date}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium dark:text-gray-200">المبلغ الإجمالي:</span>
                  <span className="dark:text-gray-200">{userOrders[selectedOrderIndex].totalPrice.toFixed(2)} د.ل</span>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium dark:text-gray-200">العنوان:</span>
                  <span className="dark:text-gray-200">{userOrders[selectedOrderIndex].city} - {userOrders[selectedOrderIndex].address}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium dark:text-gray-200">حالة الطلب:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(userOrders[selectedOrderIndex].status)}`}>
                    {getStatusLabel(userOrders[selectedOrderIndex].status)}
                  </span>
                </div>
              </div>
              
              {/* Order Status Progress Tracker */}
              <div className="mt-8 mb-4">
                <h3 className="text-lg font-medium mb-4 dark:text-white">تتبع حالة الطلب</h3>
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-8">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width:
                          userOrders[selectedOrderIndex].status === 'pending' ? '20%' :
                          userOrders[selectedOrderIndex].status === 'processing' ? '40%' :
                          userOrders[selectedOrderIndex].status === 'shipped' ? '70%' :
                          userOrders[selectedOrderIndex].status === 'delivered' ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                  
                  {/* Status Steps */}
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        ['pending', 'processing', 'shipped', 'delivered'].includes(userOrders[selectedOrderIndex].status)
                          ? 'bg-primary text-white'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <span className="text-xs">1</span>
                      </div>
                      <span className="text-xs block dark:text-gray-300">استلام الطلب</span>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        ['processing', 'shipped', 'delivered'].includes(userOrders[selectedOrderIndex].status)
                          ? 'bg-primary text-white'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <span className="text-xs">2</span>
                      </div>
                      <span className="text-xs block dark:text-gray-300">تجهيز</span>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        ['shipped', 'delivered'].includes(userOrders[selectedOrderIndex].status)
                          ? 'bg-primary text-white'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <span className="text-xs">3</span>
                      </div>
                      <span className="text-xs block dark:text-gray-300">شحن</span>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        userOrders[selectedOrderIndex].status === 'delivered'
                          ? 'bg-primary text-white'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <span className="text-xs">4</span>
                      </div>
                      <span className="text-xs block dark:text-gray-300">تسليم</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg">
                <p className="text-sm">
                  {userOrders[selectedOrderIndex].status === 'pending' && 'سيتم مراجعة طلبك قريباً وتحديث حالته.'}
                  {userOrders[selectedOrderIndex].status === 'processing' && 'جاري تجهيز طلبك، وسيتم شحنه قريباً.'}
                  {userOrders[selectedOrderIndex].status === 'shipped' && 'تم شحن طلبك وهو في الطريق إليك.'}
                  {userOrders[selectedOrderIndex].status === 'delivered' && 'تم تسليم طلبك بنجاح. نتمنى أن تكون راضياً عن منتجاتنا.'}
                  {userOrders[selectedOrderIndex].status === 'suspended' && 'تم تعليق طلبك. يرجى التواصل مع خدمة العملاء.'}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <ShoppingBag className="ml-2 text-primary" size={24} />
                <h2 className="text-xl font-bold dark:text-white">الدعم الفني</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                هل تحتاج إلى مساعدة بخصوص طلبك؟ يمكنك التواصل معنا عبر:
              </p>
              
              <div className="space-y-3">
                <a
                  href="tel:+2180922078595"
                  className="flex items-center p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <span>اتصل بنا: 0922078595</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-center text-gray-600">لم يتم العثور على معلومات الطلب</p>
        </div>
      )}

      {/* Wishlist Section */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="ml-2 text-red-500" size={24} />
            <h2 className="text-xl font-bold dark:text-white">قائمة الرغبات</h2>
          </div>
          
          <button
            onClick={() => setShowWishlistInput(!showWishlistInput)}
            className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            {showWishlistInput ? <X size={18} className="ml-1" /> : <Plus size={18} className="ml-1" />}
            <span>{showWishlistInput ? 'إلغاء' : 'إضافة منتج'}</span>
          </button>
        </div>
        
        {showWishlistInput && (
          <form onSubmit={(e) => { e.preventDefault(); if (productIdInput.trim()) handleAddToWishlist(productIdInput.trim()); }} className="mb-6 flex">
            <input
              type="text"
              value={productIdInput}
              onChange={(e) => setProductIdInput(e.target.value)}
              placeholder="أدخل رقم المنتج"
              className="flex-grow rounded-r-lg border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-l-lg hover:bg-primary/90 transition-colors"
            >
              إضافة
            </button>
          </form>
        )}
        
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist.map((product) => (
              <div key={product.id} className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                <div className="absolute top-2 left-2 z-10">
                  <button
                    onClick={(e) => { e.preventDefault(); handleRemoveFromWishlist(product.id); }}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    aria-label="إزالة من قائمة الرغبات"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="flex flex-col h-full">
                  <div className="relative pt-[70%] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-3 flex-grow flex flex-col">
                    <h3 className="font-medium mb-1 line-clamp-1 dark:text-white">{product.name}</h3>
                    <p className="text-primary font-bold">{product.price.toFixed(2)} د.ل</p>
                    
                    <button
                      onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }}
                      className="mt-auto w-full py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      عرض المنتج
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            لا توجد منتجات في قائمة الرغبات
          </p>
        )}
      </div>
      
      {/* Product Recommendations */}
      {recommendedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-6 dark:text-white">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;