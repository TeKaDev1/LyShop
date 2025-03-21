import React, { useState } from 'react';
import { Plus, Edit, Trash, Search, Film } from 'lucide-react';
import { Product, deleteProduct, saveProduct } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import ProductForm from './ProductForm';
import { AnimatePresence } from 'framer-motion';
import { Category } from '@/types';

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  refreshProducts: () => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ products, categories, refreshProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = async (product: Product) => {
    try {
      await saveProduct(product);
      toast({
        title: "تم حفظ المنتج بنجاح",
        variant: "default",
      });
      setIsAddingProduct(false);
      setSelectedProduct(null);
      refreshProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "تم حذف المنتج بنجاح",
        variant: "default",
      });
      refreshProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          إضافة منتج جديد
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <div className="relative">
            <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="البحث عن منتج..."
              className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-right py-3 px-4 dark:text-gray-200">المنتج</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">الفئة</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">السعر</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">فيديو</th>
                  <th className="text-right py-3 px-4 dark:text-gray-200">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded ml-3"
                        />
                        <span className="font-medium dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 dark:text-gray-300">{product.category}</td>
                    <td className="py-3 px-4 dark:text-gray-300">{product.price.toFixed(2)} د.ل</td>
                    <td className="py-3 px-4">
                      {product.video ? <Film size={18} className="text-green-500" /> : <span>-</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditModalOpen(true);
                          }}
                          aria-label="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDeleteProduct(product.id)}
                          aria-label="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground dark:text-gray-400 text-center py-4">
            {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد منتجات حالياً'}
          </p>
        )}
      </div>

      {/* نموذج إضافة/تعديل المنتج */}
      {(isAddingProduct || selectedProduct) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h3>
            <ProductForm 
              product={selectedProduct} 
              categories={categories}
              onClose={() => {
                setIsEditModalOpen(false);
                setIsAddingProduct(false);
                setSelectedProduct(null);
              }}
              onSave={handleSaveProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
