import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove, get } from 'firebase/database';
import { DeliveryZone, AdminCredentials, Product, Order } from '@/types';

const firebaseConfig = {
    apiKey: "AIzaSyAwvH0kCjpr5H2Wlqwpva0PC0vjxeIM46o",
    authDomain: "tekadev1.firebaseapp.com",
    projectId: "tekadev1",
    storageBucket: "tekadev1.firebasestorage.app",
    messagingSenderId: "1003700748004",
    appId: "1:1003700748004:web:ff23010162612fbef7f6f1",
    databaseURL: "https://tekadev1-default-rtdb.europe-west1.firebasedatabase.app"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// دالة لجلب المنتجات في الوقت الفعلي
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const productsRef = ref(database, 'products');
  return onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
};

// دالة لإضافة منتج جديد
export const addProduct = async (product: Omit<Product, 'id'>) => {
  const productsRef = ref(database, 'products');
  const newProductRef = push(productsRef);
  await set(newProductRef, {
    ...product,
    id: newProductRef.key
  });
  return newProductRef.key;
};

// دالة لتحديث منتج
export const updateProduct = async (productId: string, product: Product) => {
  const productRef = ref(database, `products/${productId}`);
  await set(productRef, product);
};

// دالة لجلب الطلبات في الوقت الفعلي
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(database, 'orders');
  return onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
};

// دالة لإضافة طلب جديد
export const addOrder = async (order: Omit<Order, 'id'>) => {
  const ordersRef = ref(database, 'orders');
  const newOrderRef = push(ordersRef);
  await set(newOrderRef, {
    ...order,
    id: newOrderRef.key
  });
  return newOrderRef.key;
};

// دالة لتحديث حالة الطلب
export const updateOrder = async (orderId: string, order: Order) => {
  const orderRef = ref(database, `orders/${orderId}`);
  await set(orderRef, order);
};

// وظائف التعامل مع مناطق التوصيل
export const subscribeToDeliveryZones = (callback: (zones: DeliveryZone[]) => void) => {
  const zonesRef = ref(database, 'deliveryZones');
  return onValue(zonesRef, (snapshot) => {
    const data = snapshot.val();
    const zones: DeliveryZone[] = data ? Object.values(data) : [];
    callback(zones);
  });
};

export const saveDeliveryZone = async (zone: Omit<DeliveryZone, 'id'>) => {
  const zonesRef = ref(database, 'deliveryZones');
  const newZoneRef = push(zonesRef);
  await set(newZoneRef, {
    ...zone,
    id: newZoneRef.key
  });
  return newZoneRef.key;
};

export const updateDeliveryZone = async (zone: DeliveryZone) => {
  const zoneRef = ref(database, `deliveryZones/${zone.id}`);
  await set(zoneRef, zone);
};

export const deleteDeliveryZone = async (zoneId: string) => {
  const zoneRef = ref(database, `deliveryZones/${zoneId}`);
  await remove(zoneRef);
};

// دالة لتوليد salt عشوائي
const generateSalt = () => {
  return Math.random().toString(36).substring(2);
};

// دالة لتشفير كلمة المرور باستخدام Web Crypto API
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// دالة للتحقق من بيانات اعتماد المسؤول
export const verifyAdmin = async (username: string, password: string) => {
  const adminRef = ref(database, 'adminCredentials');
  const snapshot = await get(adminRef);
  const admins: AdminCredentials[] = snapshot.val() || [];

  const admin = admins.find(a => a.username === username);
  if (!admin || !admin.salt || !admin.hashedPassword) return false;

  const hashedPassword = await hashPassword(password, admin.salt);
  return hashedPassword === admin.hashedPassword;
};

// دالة لتحديث كلمة مرور المسؤول
export const updateAdminPassword = async (username: string, newPassword: string) => {
  const adminRef = ref(database, 'adminCredentials');
  const snapshot = await get(adminRef);
  const admins: AdminCredentials[] = snapshot.val() || [];

  const adminIndex = admins.findIndex(a => a.username === username);
  if (adminIndex === -1) return false;

  const salt = generateSalt();
  const hashedPassword = await hashPassword(newPassword, salt);

  admins[adminIndex] = {
    username,
    hashedPassword,
    salt
  };

  await set(adminRef, admins);
  return true;
};

// وظيفة لتحديد سعر التوصيل في طرابلس وضواحيها
export const getTripoliDeliveryPrice = (area: string): number => {
  // مناطق طرابلس المركزية
  const centralAreas = [
    'وسط المدينة',
    'سوق الجمعة',
    'باب البحر',
    'المدينة القديمة',
    'ظهرة الشوك'
  ];

  // الضواحي القريبة
  const nearSuburbs = [
    'عين زارة',
    'تاجوراء',
    'جنزور القريبة',
    'قرجي',
    'قرقارش',
    'سيدي المصري',
    'الهضبة',
    'أبو سليم'
  ];

  // الضواحي البعيدة
  const farSuburbs = [
    'السراج',
    'جنزور البعيدة',
    'سوق السبت',
    'الكريمية',
    'عين زارة الجديدة',
    'الساعدية'
  ];

  if (centralAreas.includes(area)) {
    return 10;
  } else if (nearSuburbs.includes(area)) {
    return 15;
  } else if (farSuburbs.includes(area)) {
    return 20;
  }

  // المناطق غير المحددة
  return 20;
}; 