import React, { useState, useEffect } from 'react';
import { getProducts, Product, addProduct, updateProduct } from '@/lib/data';
import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast for notifications

interface AdminProductsProps {
  // Add any props needed
}

const AdminProducts: React.FC<AdminProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products with error handling
  const loadProducts = () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle form submission for adding a product
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    try {
      // Generate a unique ID
      const productWithId: Product = {
        ...newProduct,
        id: `product-${Date.now()}`
      };
      
      const success = addProduct(productWithId);
      
      if (success) {
        toast.success('Product added successfully');
        loadProducts(); // Reload the products list
      } else {
        toast.error('Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('An error occurred while adding the product');
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        <p>{error}</p>
        <button 
          onClick={loadProducts}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border-b">
                    <img 
                      src={product.images[0] || '/placeholder-image.jpg'} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{product.name}</td>
                  <td className="px-4 py-2 border-b">{product.category}</td>
                  <td className="px-4 py-2 border-b">{product.price.toFixed(2)} د.ل</td>
                  <td className="px-4 py-2 border-b">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Edit</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No products found. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;