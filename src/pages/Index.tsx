import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getProducts, initializeData } from '@/lib/data';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { subscribeToProducts } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة المنتج إلى السلة بنجاح",
    });
  };

  const handleAddToWishlist = (product: Product) => {
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة المنتج إلى المفضلة بنجاح",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  متجر ليبيا للتسوق
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  تسوق بأفضل الأسعار مع متجر ليبيا
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  اكتشف تشكيلة واسعة من المنتجات عالية الجودة بأسعار تنافسية مع توصيل سريع لجميع مناطق ليبيا.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/products" 
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
                  >
                    <ShoppingBag className="ml-2" size={20} />
                    <span>تسوق الآن</span>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative hidden md:block"
              >
                <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2215&auto=format&fit=crop" 
                    alt="Shopping" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" 
                    alt="Featured Product" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-100/30 rounded-full filter blur-3xl"></div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold">منتجات مميزة</h2>
                <p className="text-muted-foreground mt-2">
                  تصفح أحدث المنتجات في متجرنا
                </p>
              </div>
              <Link 
                to="/products" 
                className="inline-flex items-center text-primary hover:underline"
              >
                <span>عرض الكل</span>
                <ChevronLeft size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={false}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-primary/5 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">لماذا تختار متجر ليبيا؟</h2>
              <p className="text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
                نقدم لك تجربة تسوق فريدة مع مجموعة من المميزات التي تجعلنا الخيار الأفضل للتسوق عبر الإنترنت في ليبيا
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'جودة عالية',
                  description: 'نختار لك أفضل المنتجات من أشهر العلامات التجارية العالمية والمحلية',
                  icon: '🌟'
                },
                {
                  title: 'توصيل سريع',
                  description: 'نوصل طلبك بسرعة وأمان إلى جميع مناطق ليبيا',
                  icon: '🚚'
                },
                {
                  title: 'أسعار تنافسية',
                  description: 'نقدم لك أفضل الأسعار مع عروض وخصومات دورية',
                  icon: '💰'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover-lift"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 -z-10"></div>
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full filter blur-3xl"></div>
              </div>
              
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-4">ابدأ التسوق الآن</h2>
                <p className="text-white/80 mb-8 text-lg">
                  استمتع بتجربة تسوق سلسة وآمنة مع خيارات دفع متعددة وتوصيل سريع لجميع مناطق ليبيا
                </p>
                <Link 
                  to="/products"
                  className="px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-white/90 transition-colors inline-flex items-center"
                >
                  <ShoppingBag className="ml-2" size={20} />
                  <span>تصفح المنتجات</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
