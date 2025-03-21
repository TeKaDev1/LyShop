import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessAlertProps {
  orderNumber: string;
  onClose: () => void;
}

const OrderSuccessAlert: React.FC<OrderSuccessAlertProps> = ({ orderNumber, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            تم تأكيد طلبك بنجاح!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            رقم الطلب: {orderNumber}
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 w-full">
            <p className="text-gray-700 dark:text-gray-200 mb-3">
              يمكنك متابعة حالة طلبك في أي وقت من خلال لوحة التحكم الخاصة بك
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={onClose}
            >
              الذهاب إلى لوحة التحكم
            </Link>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <span className="sr-only">إغلاق</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccessAlert; 