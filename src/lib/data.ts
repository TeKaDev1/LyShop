
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // Can be URLs or base64 encoded strings
  video?: string; // Can be URL or base64 encoded string
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  customerName: string;
  city: string;
  address: string;
  phone: string;
  products: { productId: string; quantity: number }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'suspended';
  date: string;
}

// Sample categories data
export const categories: Category[] = [
  { id: '1', name: 'إلكترونيات' },
  { id: '2', name: 'أزياء' },
  { id: '3', name: 'عطور' },
];

// Sample product data
export const products: Product[] = [
  {
    id: '1',
    name: 'هاتف ذكي متطور',
    description: 'هاتف ذكي بمواصفات عالية، شاشة سوبر أموليد، كاميرا احترافية، وبطارية طويلة العمر.',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2235&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=2036&auto=format&fit=crop'
    ],
    category: 'إلكترونيات'
  },
  {
    id: '2',
    name: 'ساعة ذكية فاخرة',
    description: 'ساعة ذكية بتصميم أنيق، مقاومة للماء، تتبع النشاط البدني، وعمر بطارية يصل إلى 7 أيام.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2127&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'
    ],
    category: 'إلكترونيات'
  },
  {
    id: '3',
    name: 'سماعات لاسلكية',
    description: 'سماعات لاسلكية مع إلغاء الضوضاء النشط، صوت عالي الجودة، ومدة تشغيل طويلة.',
    price: 159.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481207801830-97f0f9a1337e?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'إلكترونيات'
  },
  {
    id: '4',
    name: 'حقيبة جلدية أنيقة',
    description: 'حقيبة جلدية فاخرة، مصنوعة يدويًا من أجود أنواع الجلود، مناسبة للاستخدام اليومي أو العمل.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop'
    ],
    category: 'أزياء'
  },
  {
    id: '5',
    name: 'نظارة شمسية كلاسيكية',
    description: 'نظارة شمسية بتصميم كلاسيكي، عدسات مضادة للأشعة فوق البنفسجية، وإطار متين.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615812214208-4d7399e9a016?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'أزياء'
  },
  {
    id: '6',
    name: 'عطر فاخر للرجال',
    description: 'عطر فاخر للرجال برائحة خشبية مميزة تدوم طويلًا، مناسب للمناسبات الخاصة واليومية.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1590736969596-dd610b3207a9?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'عطور'
  },
];

// Sample orders data
export const orders: Order[] = [
  {
    id: '1',
    customerName: 'أحمد محمد',
    city: 'طرابلس',
    address: 'شارع النصر، حي الأندلس',
    phone: '0912345678',
    products: [{ productId: '1', quantity: 1 }, { productId: '3', quantity: 2 }],
    totalPrice: 1619.97,
    status: 'delivered',
    date: '2023-05-15'
  },
  {
    id: '2',
    customerName: 'فاطمة علي',
    city: 'بنغازي',
    address: 'شارع عمر المختار، وسط المدينة',
    phone: '0923456789',
    products: [{ productId: '2', quantity: 1 }],
    totalPrice: 299.99,
    status: 'processing',
    date: '2023-05-20'
  },
];

// Admin users
export const adminUsers = [
  {
    username: 'dkhil',
    password: 'Mo090909' // In a real app, use a secure hashing method
  },
  {
    username: 'teka',
    password: 'Mo090909' // In a real app, use a secure hashing method
  }
];

// Local storage helpers
export const saveCategory = (category: Partial<Category>) => {
  const currentCategories = JSON.parse(localStorage.getItem('categories') || JSON.stringify(categories));
  if (category.id) {
    // Update existing category
    const updatedCategories = currentCategories.map((c: Category) => 
      c.id === category.id ? category : c
    );
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  } else {
    // Add new category
    const newCategory = {
      ...category,
      id: Date.now().toString()
    };
    localStorage.setItem('categories', JSON.stringify([...currentCategories, newCategory]));
  }
};

export const deleteCategory = (categoryId: string) => {
  const currentCategories = JSON.parse(localStorage.getItem('categories') || JSON.stringify(categories));
  const updatedCategories = currentCategories.filter((c: Category) => c.id !== categoryId);
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
};

export const getCategories = (): Category[] => {
  try {
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories) {
      console.log('No categories found in localStorage, returning default categories');
      return categories;
    }
    
    const parsedCategories = JSON.parse(storedCategories);
    
    // Validate the structure of each category
    return parsedCategories.map((category: any) => ({
      id: category.id || `category-${Date.now()}`,
      name: category.name || 'Unnamed Category'
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return categories;
  }
};

export const saveProduct = (product: Product) => {
  try {
    const currentProducts = getProducts();
    if (product.id) {
      // Update existing product
      const updatedProducts = currentProducts.map((p: Product) => 
        p.id === product.id ? product : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return true;
    } else {
      // Add new product using addProduct function
      addProduct(product);
      return true;
    }
  } catch (error) {
    console.error('Error saving product:', error);
    return false;
  }
};

// Add a function to safely add a new product
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  try {
    // Generate a new ID
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // Ensure all required fields have default values
      name: product.name || 'Unnamed Product',
      description: product.description || 'No description available',
      price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
      images: Array.isArray(product.images) ? product.images : [],
      category: product.category || 'Uncategorized'
    };
    
    // Get existing products
    const existingProducts = getProducts();
    
    // Add new product
    const updatedProducts = [...existingProducts, newProduct];
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

export const deleteProduct = (productId: string): boolean => {
  try {
    const currentProducts = getProducts();
    const updatedProducts = currentProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const getProducts = (): Product[] => {
  try {
    // Get products from localStorage
    const storedProducts = localStorage.getItem('products');
    
    // If no products in localStorage, return default products
    if (!storedProducts) {
      console.log('No products found in localStorage, returning default products');
      return products;
    }
    
    // Parse the stored products
    let parsedProducts;
    try {
      parsedProducts = JSON.parse(storedProducts);
      
      // Check if parsedProducts is an array
      if (!Array.isArray(parsedProducts)) {
        console.error('Stored products is not an array');
        return products;
      }
    } catch (parseError) {
      console.error('Error parsing products from localStorage:', parseError);
      return products;
    }
    
    // Validate and normalize each product
    return parsedProducts.map((product: any) => ({
      id: product.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: product.name || 'Unnamed Product',
      description: product.description || 'No description available',
      price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
      images: Array.isArray(product.images) ? product.images : [],
      category: product.category || 'Uncategorized',
      video: product.video || undefined
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return products;
  }
};

export const getOrders = (): Order[] => {
  try {
    const storedOrders = localStorage.getItem('orders');
    if (!storedOrders) {
      console.log('No orders found in localStorage, returning default orders');
      return orders;
    }
    
    const parsedOrders = JSON.parse(storedOrders);
    
    // Validate the structure of each order
    return parsedOrders.map((order: any): Order => {
      // Validate status
      let status: Order['status'] = 'pending';
      if (['pending', 'processing', 'shipped', 'delivered', 'suspended'].includes(order.status)) {
        status = order.status as Order['status'];
      }
      
      return {
        id: order.id || '100',
        customerName: order.customerName || 'Unknown Customer',
        city: order.city || '',
        address: order.address || '',
        phone: order.phone || '',
        products: Array.isArray(order.products) ? order.products : [],
        totalPrice: typeof order.totalPrice === 'number' ? order.totalPrice : 0,
        status,
        date: order.date || new Date().toISOString().split('T')[0]
      };
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return orders;
  }
};

export const saveOrder = (order: Omit<Order, 'date' | 'status'> & { id?: string }): Order | null => {
  try {
    const currentOrders = getOrders();
    
    // Use provided ID or generate a new one
    let orderId: string;
    
    if (order.id) {
      // Use the provided ID
      orderId = order.id;
    } else {
      // Generate a new order ID starting from 100
      let newOrderId = 100;
      
      // Find the highest existing order ID and increment by 1
      if (currentOrders.length > 0) {
        const orderIds = currentOrders
          .map(order => {
            // Extract numeric part of the order ID
            const idNumber = parseInt(order.id, 10);
            return isNaN(idNumber) ? 100 : idNumber;
          })
          .filter(id => !isNaN(id));
        
        if (orderIds.length > 0) {
          newOrderId = Math.max(...orderIds) + 1;
        }
      }
      
      orderId = newOrderId.toString();
    }
    
    const newOrder: Order = {
      ...order,
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    localStorage.setItem('orders', JSON.stringify([...currentOrders, newOrder]));
    return newOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    return null;
  }
};

// Function to delete an order
export const deleteOrder = (orderId: string): boolean => {
  try {
    const currentOrders = getOrders();
    const updatedOrders = currentOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
};

// Function to update order status
export const updateOrderStatus = (
  orderId: string,
  newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'suspended'
): Order | null => {
  try {
    const currentOrders = getOrders();
    const orderIndex = currentOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      console.error(`Order with ID ${orderId} not found`);
      return null;
    }
    
    // Create a copy of the order with the updated status
    const updatedOrder: Order = {
      ...currentOrders[orderIndex],
      status: newStatus
    };
    
    // Update the order in the array
    const updatedOrders = [...currentOrders];
    updatedOrders[orderIndex] = updatedOrder;
    
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};

// Initialize local storage with sample data
export const initializeData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(categories));
  }
};
