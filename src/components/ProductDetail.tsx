
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ShoppingBag, Film, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';

interface ProductDetailProps {
  product: Product;
  onBuyClick: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBuyClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Product Images and Gallery */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
              <motion.img
                key={currentImageIndex}
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Image Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
              <button
                onClick={prevImage}
                className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Previous Image"
              >
                <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={nextImage}
                className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Next Image"
              >
                <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="flex flex-wrap gap-2 justify-center">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${product.name} - صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Video Section (if available) */}
          {product.video && product.video.trim() !== '' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <Film size={18} className="ml-2 text-primary" />
                <h3 className="font-medium dark:text-white">فيديو المنتج</h3>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                {product.video.startsWith('data:video') ? (
                  <video
                    src={product.video}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <iframe
                    src={product.video.includes('youtube.com')
                      ? product.video.replace('watch?v=', 'embed/')
                      : product.video}
                    title={`فيديو ${product.name}`}
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="p-6 flex flex-col">
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {product.category}
            </span>
            
            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary">{product.price.toFixed(2)}</span>
              <span className="text-lg mr-1 text-gray-700 dark:text-gray-300">د.ل</span>
            </div>
            
            {/* Description */}
            <div className="py-4 border-t border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">وصف المنتج</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>
            
            {/* Buy Button */}
            <button
              onClick={onBuyClick}
              className="w-full py-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ShoppingBag className="ml-2" size={20} />
              <span>شراء الآن</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
