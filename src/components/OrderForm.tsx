import React, { useState, useEffect } from 'react';
import { Product, Order, DeliveryZone, CreateOrderData } from '@/types';
import { saveOrder, getProducts } from '@/lib/data';
import { sendOrderEmail } from '@/lib/emailjs';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, Minus, ShoppingCart, Trash2, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import OrderSuccessAlert from './OrderSuccessAlert';
import ProductPreviewCard from './ProductPreviewCard';
import { subscribeToDeliveryZones, getTripoliDeliveryPrice } from '@/lib/firebase';

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

interface OrderFormData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  quantity: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [selectedArea, setSelectedArea] = useState('');
  const [isTripoliArea, setIsTripoliArea] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<Array<{city: string, price: number, group: string}>>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>();

  // تجهيز قائمة المدن
  const allCities = [
    { city: "طرابلس", price: 10, group: "طرابلس" },
    // المنطقة الشرقية
    { city: "بنغازي", price: 20, group: "المنطقة الشرقية" },
    { city: "البيضاء", price: 35, group: "المنطقة الشرقية" },
    { city: "المرج", price: 35, group: "المنطقة الشرقية" },
    { city: "درنة", price: 35, group: "المنطقة الشرقية" },
    { city: "طبرق", price: 40, group: "المنطقة الشرقية" },
    { city: "الابيار", price: 35, group: "المنطقة الشرقية" },
    { city: "القبة", price: 35, group: "المنطقة الشرقية" },
    { city: "شحات", price: 35, group: "المنطقة الشرقية" },
    { city: "سوسه", price: 35, group: "المنطقة الشرقية" },
    { city: "البرق", price: 35, group: "المنطقة الشرقية" },
    { city: "توكرة", price: 35, group: "المنطقة الشرقية" },
    { city: "سلوق", price: 40, group: "المنطقة الشرقية" },
    { city: "امساعد", price: 40, group: "المنطقة الشرقية" },
    { city: "راس لانوف", price: 25, group: "المنطقة الشرقية" },
    { city: "بن جواد", price: 25, group: "المنطقة الشرقية" },
    { city: "قمينس", price: 25, group: "المنطقة الشرقية" },
    { city: "ابوقرين", price: 25, group: "المنطقة الشرقية" },
    { city: "البريقة", price: 25, group: "المنطقة الشرقية" },
    { city: "بشر", price: 25, group: "المنطقة الشرقية" },
    { city: "هراوة", price: 25, group: "المنطقة الشرقية" },
    { city: "اجدابيا", price: 20, group: "المنطقة الشرقية" },
    // المنطقة الوسطى
    { city: "مصراتة", price: 10, group: "المنطقة الوسطى" },
    { city: "زليتن", price: 15, group: "المنطقة الوسطى" },
    { city: "الخمس", price: 15, group: "المنطقة الوسطى" },
    { city: "مسلاتة", price: 25, group: "المنطقة الوسطى" },
    { city: "سوق الخميس الخمس", price: 20, group: "المنطقة الوسطى" },
    { city: "تاورغاء", price: 25, group: "المنطقة الوسطى" },
    { city: "العلوص", price: 15, group: "المنطقة الوسطى" },
    { city: "سيدي السائح", price: 25, group: "المنطقة الوسطى" },
    { city: "بني وليد", price: 25, group: "المنطقة الوسطى" },
    { city: "ترهونه", price: 25, group: "المنطقة الوسطى" },
    { city: "سوق الخميس امسيحل", price: 20, group: "المنطقة الوسطى" },
    { city: "السبيعة", price: 20, group: "المنطقة الوسطى" },
    { city: "العربان", price: 30, group: "المنطقة الوسطى" },
    // منطقة الجبل الغربي
    { city: "غريان", price: 30, group: "منطقة الجبل الغربي" },
    { city: "يفرن", price: 30, group: "منطقة الجبل الغربي" },
    { city: "نالوت", price: 30, group: "منطقة الجبل الغربي" },
    { city: "القلعة", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الزنتان", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الاصابعة", price: 30, group: "منطقة الجبل الغربي" },
    { city: "ككلة", price: 30, group: "منطقة الجبل الغربي" },
    { city: "كاباو", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الرجبان", price: 30, group: "منطقة الجبل الغربي" },
    { city: "القواليش", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الجواد", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الرابطة", price: 30, group: "منطقة الجبل الغربي" },
    { city: "قصر الحاج", price: 30, group: "منطقة الجبل الغربي" },
    { city: "شكشوك", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الجوش", price: 30, group: "منطقة الجبل الغربي" },
    { city: "تغزين", price: 30, group: "منطقة الجبل الغربي" },
    { city: "بدر", price: 30, group: "منطقة الجبل الغربي" },
    { city: "الرحيبات", price: 30, group: "منطقة الجبل الغربي" },
    { city: "جادو", price: 35, group: "منطقة الجبل الغربي" },
    { city: "الحرابة", price: 30, group: "منطقة الجبل الغربي" },
    // المنطقة الجنوبية
    { city: "سبها", price: 20, group: "المنطقة الجنوبية" },
    { city: "الشويرف", price: 35, group: "المنطقة الجنوبية" },
    { city: "براك الشاطي", price: 30, group: "المنطقة الجنوبية" },
    { city: "أوباري", price: 35, group: "المنطقة الجنوبية" },
    { city: "مرزق", price: 40, group: "المنطقة الجنوبية" },
    { city: "غدوة", price: 40, group: "المنطقة الجنوبية" },
    { city: "ام الارانب", price: 40, group: "المنطقة الجنوبية" },
    { city: "تراغن", price: 40, group: "المنطقة الجنوبية" },
    { city: "وادي عتبه", price: 40, group: "المنطقة الجنوبية" },
    { city: "غات", price: 35, group: "المنطقة الجنوبية" },
    { city: "القطرون", price: 40, group: "المنطقة الجنوبية" },
    { city: "القريات", price: 40, group: "المنطقة الجنوبية" },
    { city: "سنو", price: 30, group: "المنطقة الجنوبية" },
    { city: "مزدة", price: 35, group: "المنطقة الجنوبية" },
    { city: "نسمة", price: 40, group: "المنطقة الجنوبية" },
    { city: "بنت بيه", price: 45, group: "المنطقة الجنوبية" },
    { city: "هون", price: 25, group: "المنطقة الجنوبية" },
    { city: "ودان", price: 30, group: "المنطقة الجنوبية" },
    { city: "سوكنة", price: 30, group: "المنطقة الجنوبية" },
    { city: "الجفرة", price: 30, group: "المنطقة الجنوبية" },
    // المنطقة الغربية
    { city: "رقدالين", price: 25, group: "المنطقة الغربية" },
    { city: "الجميل", price: 25, group: "المنطقة الغربية" },
    { city: "زوارة", price: 25, group: "المنطقة الغربية" },
    { city: "العجيلات", price: 25, group: "المنطقة الغربية" },
    { city: "صرمان", price: 15, group: "المنطقة الغربية" },
    { city: "صبراتة", price: 15, group: "المنطقة الغربية" },
    { city: "زلطن", price: 25, group: "المنطقة الغربية" },
    { city: "جنزور", price: 15, group: "المنطقة الغربية" },
    { city: "الماية", price: 25, group: "المنطقة الغربية" },
  ];

  // تحديث المدن المفلترة عند تغيير مصطلح البحث
  useEffect(() => {
    const filtered = citySearchTerm
      ? allCities.filter(city => 
          city.city.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
          city.group.toLowerCase().includes(citySearchTerm.toLowerCase())
        )
      : allCities;
    setFilteredCities(filtered);
  }, [citySearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'customerName' || name === 'phone' || name === 'address' || name === 'city' || name === 'notes' || name === 'quantity') {
      register(name);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const removeFromCart = async (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    
    // If cart becomes empty, add the original product back
    if (updatedCart.length === 0) {
      updatedCart.push({ product, quantity: 1 });
    }
    
    setCart(updatedCart);
    
    try {
      // Update available products
      const products = await getProducts();
      const filteredProducts = products.filter(p => !updatedCart.some(item => item.product.id === p.id));
      setAvailableProducts(filteredProducts);
    } catch (error) {
      console.error('Error updating available products:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث قائمة المنتجات المتاحة",
        variant: "destructive",
      });
    }
  };

  const addProductToCart = (productToAdd: Product) => {
    setCart([...cart, { product: productToAdd, quantity: 1 }]);
    setShowProductSelector(false);
    
    // Update available products
    setAvailableProducts(availableProducts.filter(p => p.id !== productToAdd.id));
  };

  const calculateTotal = () => {
    const productsTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    return productsTotal + deliveryPrice;
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      setLoading(true);
      
      // تجهيز تفاصيل المنتجات
      const orderProducts = cart.map(item => ({
        productId: item.product.id,
        
        quantity: item.quantity
      }));

      const orderData: CreateOrderData = {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        notes: data.notes,
        products: orderProducts,
        totalPrice: calculateTotal()
      };

      const savedOrder = await saveOrder(orderData);
      
      if (!savedOrder) {
        throw new Error('فشل في حفظ الطلب');
      }
      
      setOrderNumber(savedOrder.id);
      setShowSuccess(true);

      // تجهيز تفاصيل المنتجات للبريد الإلكتروني
      const productDetailsText = cart.map(item =>
        `${item.product.name} - ${item.quantity} × ${item.product.price.toFixed(2)} د.ل = ${(item.product.price * item.quantity).toFixed(2)} د.ل`
      ).join('\n');

      // تجهيز بيانات البريد الإلكتروني
      const emailData = {
        customerName: data.customerName,
        city: data.city,
        address: data.address,
        phone: data.phone,
        productDetails: productDetailsText,
        totalPrice: calculateTotal(),
        orderId: savedOrder.id
      };

      // إرسال إشعار البريد الإلكتروني
      await sendOrderEmail(emailData);

      // عرض رسالة النجاح مع رقم الطلب
      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: (
          <div>
            <div className="flex items-center mb-2">
              <CheckCircle className="ml-2 text-green-500" size={18} />
              <span>{`رقم الطلب الخاص بك هو: ${savedOrder.id}. سيتم التواصل معك قريبًا لتأكيد الطلب.`}</span>
            </div>
          </div>
        ),
      });

      // إغلاق النموذج
      onClose();

      // الانتقال إلى الصفحة الرئيسية
      navigate('/');
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        if (Array.isArray(productsData)) {
          const filteredProducts = productsData.filter(p => p.id !== product.id);
          setAvailableProducts(filteredProducts);

          // تحميل المنتجات المشابهة
          const similar = filteredProducts
            .filter(p => p.category === product.category)
            .slice(0, 4); // عرض أول 4 منتجات مشابهة فقط
          setSimilarProducts(similar);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "حدث خطأ",
          description: "فشل في تحميل المنتجات المشابهة",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
    setCart([{ product, quantity: 1 }]);

    // الاشتراك في تحديثات مناطق التوصيل
    const unsubscribeDeliveryZones = subscribeToDeliveryZones((zones) => {
      setDeliveryZones(zones);
    });

    return () => {
      unsubscribeDeliveryZones();
    };
  }, [product]);

  // تحديث سعر التوصيل عند اختيار المدينة
  useEffect(() => {
    if (selectedCity) {
      if (selectedCity === 'طرابلس') {
        setIsTripoliArea(true);
        setDeliveryPrice(getTripoliDeliveryPrice(selectedArea));
      } else {
        setIsTripoliArea(false);
        const zone = deliveryZones.find(zone => 
          zone.cities.some(city => city.toLowerCase() === selectedCity.toLowerCase())
        );
        setDeliveryPrice(zone ? zone.price : 0);
      }
    } else {
      setDeliveryPrice(0);
    }
  }, [selectedCity, selectedArea, deliveryZones]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto pb-safe-area-inset-bottom"
      >
        <div className="sticky top-0 bg-background p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">طلب المنتج</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">إغلاق</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* المنتجات المشابهة */}
        {similarProducts.length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold mb-3">منتجات مشابهة قد تعجبك</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similarProducts.map((similarProduct) => (
                <ProductPreviewCard
                  key={similarProduct.id}
                  product={similarProduct}
                  onAdd={(p) => {
                    const existingItem = cart.find(item => item.product.id === p.id);
                    if (!existingItem) {
                      setCart([...cart, { product: p, quantity: 1 }]);
                      toast({
                        title: "تمت الإضافة",
                        description: `تم إضافة ${p.name} إلى طلبك`,
                      });
                    }
                  }}
                  isSelected={cart.some(item => item.product.id === similarProduct.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* عرض المنتجات في السلة */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold mb-3">المنتجات المختارة</h3>
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">{index + 1}</span>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-primary font-bold">
                      {item.product.price.toFixed(2)} د.ل
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* إجمالي السعر */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">الإجمالي:</span>
              <span className="text-xl font-bold text-primary">{calculateTotal().toFixed(2)} د.ل</span>
            </div>
          </div>
        </div>

        {/* نموذج الطلب */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              id="customerName"
              {...register('customerName', { required: true })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
              placeholder="أدخل اسمك الكامل"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-500">هذا الحقل مطلوب</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { required: true })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
              placeholder="أدخل رقم هاتفك"
              dir="ltr"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">هذا الحقل مطلوب</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              العنوان
            </label>
            <textarea
              id="address"
              {...register('address', { required: true })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
              placeholder="أدخل عنوان التوصيل بالتفصيل"
              rows={3}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">هذا الحقل مطلوب</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              المدينة
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن مدينتك..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 mb-2"
                value={citySearchTerm}
                onChange={(e) => setCitySearchTerm(e.target.value)}
              />
              <select
                id="city"
                {...register('city', { required: true })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  if (e.target.value !== 'طرابلس') {
                    setSelectedArea('');
                  }
                }}
                required
              >
                <option value="">اختر المدينة</option>
                {filteredCities.map((cityData, index) => (
                  <option key={index} value={cityData.city}>
                    {`${cityData.city} (${cityData.price} د.ل)`}
                  </option>
                ))}
              </select>
            </div>
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">يرجى اختيار المدينة</p>
            )}
          </div>

          {/* حقل المنطقة لطرابلس فقط */}
          {selectedCity === 'طرابلس' && (
            <div>
              <label htmlFor="area" className="block text-sm font-medium mb-1">
                المنطقة
              </label>
              <select
                id="area"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                required
              >
                <option value="">اختر المنطقة</option>
                <optgroup label="وسط المدينة (10 د.ل)">
                  <option value="وسط المدينة">وسط المدينة</option>
                  <option value="سوق الجمعة">سوق الجمعة</option>
                  <option value="باب البحر">باب البحر</option>
                  <option value="المدينة القديمة">المدينة القديمة</option>
                  <option value="ظهرة الشوك">ظهرة الشوك</option>
                  <option value="الظهرة">الظهرة</option>
                  <option value="الدهماني">الدهماني</option>
                  <option value="النوفليين">النوفليين</option>
                </optgroup>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
              placeholder="أي ملاحظات إضافية حول الطلب"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              الكمية
            </label>
            <input
              type="number"
              id="quantity"
              {...register('quantity', { required: true, min: 1 })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
              defaultValue={1}
              min={1}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">يجب أن تكون الكمية 1 على الأقل</p>
            )}
          </div>

          {/* تفاصيل السعر */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">سعر المنتجات:</span>
              <span className="font-medium">{cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)} د.ل</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">سعر التوصيل:</span>
              <span className="font-medium">{deliveryPrice.toFixed(2)} د.ل</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">الإجمالي:</span>
                <span className="text-xl font-bold text-primary">{calculateTotal().toFixed(2)} د.ل</span>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-background pt-4 pb-safe-area-inset-bottom">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <OrderSuccessAlert
            orderNumber={orderNumber}
            onClose={() => {
              setShowSuccess(false);
              onClose();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderForm;
