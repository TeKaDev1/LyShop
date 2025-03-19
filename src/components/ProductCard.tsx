
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  // Add safety check for product
  if (!product) {
    return null; // Don't render anything if product is undefined
  }

  // Ensure we have valid data with fallbacks
  const {
    id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name = 'Unnamed Product',
    price = 0,
    category = 'Uncategorized',
    images = []
  } = product;

  // Ensure we have at least one image or use a placeholder
  const imageUrl = images && images.length > 0 ? images[0] : '/placeholder-image.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden hover-glow bg-white dark:bg-gray-800"
    >
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        <div className="p-4">
          <div className="text-xs font-medium text-primary/70 dark:text-primary/90 mb-2">
            {category}
          </div>
          <h3 className="font-semibold text-lg mb-2 dark:text-white">{name}</h3>
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg dark:text-white">
              {typeof price === 'number' ? price.toFixed(2) : '0.00'} <span className="text-sm dark:text-gray-300">د.ل</span>
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              عرض التفاصيل
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
