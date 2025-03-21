import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onAddToCart, onAddToWishlist, isInWishlist }) => {
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
    images = [],
    discount
  } = product;

  // Ensure we have at least one image or use a placeholder
  const imageUrl = images && images.length > 0 ? images[0] : '/placeholder-image.jpg';

  const calculateDiscountedPrice = (price: number, discount?: number): number => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden hover-glow bg-white dark:bg-gray-800"
    >
      <Link to={`/product/${id}`}>
        <div className="relative pb-[100%]">
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
          {discount && discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              خصم {discount}%
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="text-xs font-medium text-primary/70 dark:text-primary/90 mb-2">
            {category}
          </div>
          <h3 className="font-semibold text-lg mb-2 dark:text-white">{name}</h3>
          <div className="flex items-center justify-between mb-3">
            <div>
              {discount && discount > 0 ? (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    {calculateDiscountedPrice(price, discount).toFixed(2)} د.ل
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {price.toFixed(2)} د.ل
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">
                  {price.toFixed(2)} د.ل
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(product);
                }}
                className={`p-2 rounded-full transition-colors ${
                  isInWishlist
                    ? 'bg-red-100 text-red-500 dark:bg-red-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Heart
                  size={20}
                  className={isInWishlist ? 'fill-current' : ''}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
