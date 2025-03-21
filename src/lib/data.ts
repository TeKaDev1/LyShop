import { ref, set, get, push, remove } from 'firebase/database';
import { database } from './firebase';
import type { Product, Order, CreateOrderData, Category } from '@/types';

// دالة لحذف منتج
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    await remove(ref(database, `products/${productId}`));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// دالة لحفظ منتج جديد
export const saveProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const newProductRef = push(ref(database, 'products'));
    const newProduct: Product = {
      ...product,
      id: newProductRef.key!
    };
    await set(newProductRef, newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
};

// بيانات المستخدمين الإداريين
export const adminUsers = [
  {
    username: 'dkhil',
    password: 'Mo090909'
  },
  {
    username: 'teka',
    password: 'Mo090909'
  }
];

export async function getProducts(): Promise<Product[]> {
  try {
    const snapshot = await get(ref(database, 'products'));
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function saveOrder(orderData: CreateOrderData): Promise<Order | null> {
  try {
    const newOrderRef = push(ref(database, 'orders'));
    const newOrder: Order = {
      ...orderData,
      id: newOrderRef.key!,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    await set(newOrderRef, newOrder);
    return newOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    return null;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await get(ref(database, 'orders'));
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: Order['status']
): Promise<Order | null> {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (!snapshot.exists()) return null;
    
    const updatedOrder = {
      ...snapshot.val(),
      status: newStatus
    };
    await set(orderRef, updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    await remove(ref(database, `orders/${orderId}`));
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

export async function getWishlist(userId: string): Promise<string[]> {
  try {
    const snapshot = await get(ref(database, `wishlists/${userId.replace(/\D/g, '')}`));
    if (!snapshot.exists()) return [];
    return snapshot.val().productIds || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function saveWishlist(userId: string, productIds: string[]): Promise<boolean> {
  try {
    await set(ref(database, `wishlists/${userId.replace(/\D/g, '')}`), { productIds });
    return true;
  } catch (error) {
    console.error('Error saving wishlist:', error);
    return false;
  }
}

export async function addToWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const currentWishlist = await getWishlist(userId);
    if (currentWishlist.includes(productId)) return true;
    
    const updatedWishlist = [...currentWishlist, productId];
    return saveWishlist(userId, updatedWishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const currentWishlist = await getWishlist(userId);
    const updatedWishlist = currentWishlist.filter(id => id !== productId);
    return saveWishlist(userId, updatedWishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
}

export async function updateOrdersWithWishlistFlag(userId: string): Promise<void> {
  try {
    const currentOrders = await getOrders();
    const normalizedUserId = userId.replace(/\D/g, '');
    const wishlist = await getWishlist(userId);
    const hasWishlist = wishlist.length > 0;
    
    const updatedOrders = currentOrders.map(order => {
      if (order.phone.replace(/\D/g, '').includes(normalizedUserId)) {
        return { ...order, hasWishlist };
      }
      return order;
    });
    
    await set(ref(database, 'orders'), updatedOrders);
  } catch (error) {
    console.error('Error updating orders with wishlist flag:', error);
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await get(ref(database, 'categories'));
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// دالة لحذف فئة
export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    await remove(ref(database, `categories/${categoryId}`));
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// دالة لتهيئة البيانات الأولية
export const initializeData = async (): Promise<void> => {
  try {
    // التحقق من وجود الفئات
    const categoriesSnapshot = await get(ref(database, 'categories'));
    if (!categoriesSnapshot.exists()) {
      await set(ref(database, 'categories'), {});
    }

    // التحقق من وجود المنتجات
    const productsSnapshot = await get(ref(database, 'products'));
    if (!productsSnapshot.exists()) {
      await set(ref(database, 'products'), {});
    }

    // التحقق من وجود الطلبات
    const ordersSnapshot = await get(ref(database, 'orders'));
    if (!ordersSnapshot.exists()) {
      await set(ref(database, 'orders'), {});
    }

    // التحقق من وجود قائمة الرغبات
    const wishlistsSnapshot = await get(ref(database, 'wishlists'));
    if (!wishlistsSnapshot.exists()) {
      await set(ref(database, 'wishlists'), {});
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// دالة لحفظ فئة جديدة
export const saveCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const newCategoryRef = push(ref(database, 'categories'));
    const newCategory: Category = {
      ...category,
      id: newCategoryRef.key!
    };
    await set(newCategoryRef, newCategory);
    return newCategory;
  } catch (error) {
    console.error('Error saving category:', error);
    return null;
  }
}; 