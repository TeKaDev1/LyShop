import React, { useState, useEffect } from 'react';
import { Product, saveOrder, getProducts } from '@/lib/data';
import { sendOrderEmail } from '@/lib/emailjs';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    city: '',
    address: '',
    phone: '',
  });

  // Initialize cart with the initial product
  useEffect(() => {
    setCart([{ product, quantity: 1 }]);
    
    // Load all products for the product selector
    const products = getProducts();
    setAvailableProducts(products.filter(p => p.id !== product.id));
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    
    // If cart becomes empty, add the original product back
    if (updatedCart.length === 0) {
      updatedCart.push({ product, quantity: 1 });
    }
    
    setCart(updatedCart);
    
    // Update available products
    setAvailableProducts(getProducts().filter(p => !updatedCart.some(item => item.product.id === p.id)));
  };

  const addProductToCart = (productToAdd: Product) => {
    setCart([...cart, { product: productToAdd, quantity: 1 }]);
    setShowProductSelector(false);
    
    // Update available products
    setAvailableProducts(availableProducts.filter(p => p.id !== productToAdd.id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order data
      const orderData = {
        customerName: formData.customerName,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        products: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        totalPrice: calculateTotal()
      };

      // Prepare product details for email
      const productDetailsText = cart.map(item =>
        `${item.product.name} - ${item.quantity} × ${item.product.price.toFixed(2)} د.ل = ${(item.product.price * item.quantity).toFixed(2)} د.ل`
      ).join('\n');

      // Prepare email data
      const emailData = {
        customerName: formData.customerName,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        productDetails: productDetailsText,
        totalPrice: calculateTotal()
      };

      // Save order to local storage
      const savedOrder = saveOrder(orderData);

      // Send email notification
      const emailSuccess = await sendOrderEmail(emailData);

      // Show success message with order number
      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: (
          <div className="flex items-center">
            <CheckCircle className="ml-2 text-green-500" size={18} />
            <span>{`رقم الطلب الخاص بك هو: ${savedOrder.id}. سيتم التواصل معك قريبًا لتأكيد الطلب.`}</span>
          </div>
        ),
      });

      // Close form
      onClose();

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "حدث خطأ!",
        description: "لم يتم إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">إكمال الطلب</h2>

          {/* Cart Items */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center dark:text-white">
                المنتجات المختارة
                <span className="inline-flex items-center justify-center bg-primary text-white text-xs rounded-full w-5 h-5 mr-2">
                  {cart.length}
                </span>
              </h3>
              {availableProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowProductSelector(!showProductSelector)}
                  className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center hover:bg-primary/20 transition-colors"
                >
                  <Plus size={16} className="ml-1" />
                  إضافة منتج آخر
                </button>
              )}
            </div>

            {/* Product Selector */}
            {showProductSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg mb-4 max-h-60 overflow-y-auto border border-primary/20"
              >
                <h4 className="text-sm font-medium mb-3 flex items-center dark:text-white">
                  <ShoppingCart size={16} className="ml-2 text-primary" />
                  اختر منتج لإضافته للطلب
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableProducts.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center p-2 bg-white dark:bg-gray-700 hover:bg-primary/5 dark:hover:bg-primary/20 rounded-md cursor-pointer border border-gray-100 dark:border-gray-600 hover:border-primary/30 dark:hover:border-primary/40 transition-all"
                      onClick={() => addProductToCart(p)}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-md ml-3"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{p.name}</h5>
                        <p className="text-primary text-sm font-bold">{p.price.toFixed(2)} د.ل</p>
                      </div>
                      <div className="bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full text-primary">
                        <Plus size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  className="flex items-center p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-md ml-3"
                    />
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <div className="flex items-center">
                      <p className="text-primary font-bold">
                        {item.product.price.toFixed(2)} د.ل
                      </p>
                      {item.quantity > 1 && (
                        <p className="mr-2 text-gray-600 text-sm">
                          × {item.quantity} = <span className="font-bold">{(item.product.price * item.quantity).toFixed(2)} د.ل</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex items-center bg-white rounded-full border border-gray-200 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {cart.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFromCart(index)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        title="إزالة من الطلب"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/20 mt-4">
              <div className="flex items-center">
                <ShoppingCart size={20} className="ml-2 text-primary" />
                <span className="font-medium">إجمالي الطلب:</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-primary font-bold text-xl">{calculateTotal().toFixed(2)} د.ل</span>
                <span className="text-xs text-gray-600">شامل ضريبة القيمة المضافة</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">الاسم</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                value={formData.customerName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-white dark:text-gray-900 dark:border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">المدينة</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-white dark:text-gray-900 dark:border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">العنوان</label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-white dark:text-gray-900 dark:border-gray-700"
                rows={2}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-white dark:text-gray-900 dark:border-gray-700"
                placeholder="مثال: 0912345678"
              />
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center"
                disabled={loading}
              >
                {loading ? 'جاري الإرسال...' : (
                  <>
                    <ShoppingCart className="ml-2" size={18} />
                    <span>تأكيد الطلب</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderForm;
