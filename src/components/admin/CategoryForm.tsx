
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Category, saveCategory } from '@/lib/data';
import { toast } from '@/hooks/use-toast';

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
  onSave: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive",
      });
      return;
    }

    saveCategory({
      id: category?.id,
      name: name.trim()
    });
    
    onSave();
    
    toast({
      title: category ? "تم تحديث الفئة" : "تم إضافة الفئة",
      description: category ? "تم تحديث الفئة بنجاح" : "تم إضافة الفئة بنجاح",
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            {category ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-200">اسم الفئة</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {category ? 'تحديث الفئة' : 'إضافة الفئة'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryForm;
