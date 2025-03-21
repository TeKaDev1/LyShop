import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              توصيل سريع لجميع أنحاء ليبيا
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              نوفر خدمة توصيل موثوقة وسريعة لجميع المدن الليبية، مع تتبع مباشر لطلبك
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Link
                to="/products"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                تسوق الآن
              </Link>
              <Link
                to="/about"
                className="bg-white dark:bg-gray-800 text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                تعرف علينا
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/libya-map-3d.svg"
              alt="خريطة ليبيا"
              className="w-full h-auto max-w-lg mx-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:hidden"></div>
          </div>
        </div>
      </div>
      
      {/* ميزات الخدمة */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">توصيل لجميع المدن</h3>
            <p className="text-gray-600 dark:text-gray-300">نصل إلى جميع المدن الليبية بأسعار منافسة</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">توصيل سريع</h3>
            <p className="text-gray-600 dark:text-gray-300">نضمن وصول طلبك في أسرع وقت ممكن</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">خدمة موثوقة</h3>
            <p className="text-gray-600 dark:text-gray-300">نضمن سلامة وأمان طلبك حتى يصل إليك</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 