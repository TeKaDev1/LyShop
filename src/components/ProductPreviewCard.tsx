import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Info, Check, Facebook } from 'lucide-react';
import { Product } from '@/types';
import { generateProductLink, trackProductView } from '@/lib/facebook';
import { Button } from '@/components/ui/button';

interface ProductPreviewCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({ product, onAdd, isSelected, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // تتبع مشاهدة المنتج
    trackProductView(product);
  }, [product]);

  const handleShareOnFacebook = () => {
    const productLink = generateProductLink(product);
    window.open(productLink, '_blank');
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
      >
        {/* صورة المنتج */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowDetails(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === index
                      ? 'bg-primary'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* معلومات المنتج */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-primary font-bold">{product.price.toFixed(2)} د.ل</p>
        </div>

        {/* زر الإضافة */}
        <button
          onClick={() => onAdd(product)}
          disabled={isSelected}
          className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
            isSelected
              ? 'bg-primary/10 text-primary cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isSelected ? <Check size={18} /> : <Plus size={18} />}
        </button>

        {/* زر عرض التفاصيل */}
        <button
          onClick={() => setShowDetails(true)}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/60 transition-colors"
        >
          <Info size={18} />
        </button>
      </motion.div>

      {/* نافذة التفاصيل */}
      <AnimatePresence>
        {showDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowDetails(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-[50%] translate-y-[-50%] z-50 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-w-lg mx-auto shadow-xl"
            >
              <div className="relative">
                {/* صور المنتج */}
                <div className="aspect-video relative">
                  <motion.img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    layoutId={`product-image-${product.id}`}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentImageIndex === index
                            ? 'bg-primary'
                            : 'bg-white/70 hover:bg-white'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* معلومات المنتج */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-primary text-2xl font-bold">
                      {product.price.toFixed(2)} د.ل
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleShareOnFacebook}
                    >
                      <Facebook className="h-4 w-4" />
                      مشاركة
                    </Button>
                  </div>
                </div>

                {/* زر الإغلاق */}
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/60 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductPreviewCard; 