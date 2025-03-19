import React from 'react';
import { motion } from 'framer-motion';

export const ProductSkeleton: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-2 w-3/4" />
        
        {/* Price skeleton */}
        <div className="h-5 bg-gray-200 rounded-md animate-pulse mb-3 w-1/3" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full" />
          <div className="h-4 bg-gray-100 rounded-md animate-pulse w-5/6" />
        </div>
      </div>
    </motion.div>
  );
};

// Default export for easier imports
export default ProductSkeleton;
