
import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Category, Product, deleteCategory } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import CategoryForm from './CategoryForm';
import { AnimatePresence } from 'framer-motion';

interface CategoriesTabProps {
  categories: Category[];
  products: Product[];
  refreshCategories: () => void;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({ categories, products, refreshCategories }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      deleteCategory(categoryId);
      refreshCategories();
      toast({
        title: "تم حذف الفئة",
        description: "تم حذف الفئة بنجاح",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">الفئات</h2>
        <button
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center hover:bg-primary/90 transition-colors"
          onClick={() => {
            setSelectedCategory(null);
            setIsCategoryModalOpen(true);
          }}
        >
          <Plus size={18} className="ml-2" />
          <span>إضافة فئة</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-right py-3 px-4 dark:text-gray-200">اسم الفئة</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">عدد المنتجات</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const categoryProductCount = products.filter(product => 
                    product.category === category.name
                  ).length;
                  
                  return (
                    <tr key={category.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 font-medium dark:text-gray-200">{category.name}</td>
                      <td className="py-3 px-4 dark:text-gray-200">{categoryProductCount}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsCategoryModalOpen(true);
                            }}
                            aria-label="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className={`p-2 rounded ${categoryProductCount > 0
                              ? 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-not-allowed'
                              : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                            onClick={() => categoryProductCount === 0 && handleDeleteCategory(category.id)}
                            aria-label="Delete"
                            disabled={categoryProductCount > 0}
                            title={categoryProductCount > 0 ? "لا يمكن حذف فئة تحتوي على منتجات" : ""}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 dark:text-gray-300">لا توجد فئات حالياً</p>
        )}
      </div>

      <AnimatePresence>
        {isCategoryModalOpen && (
          <CategoryForm 
            category={selectedCategory} 
            onClose={() => setIsCategoryModalOpen(false)} 
            onSave={refreshCategories}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoriesTab;
