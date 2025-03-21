import { Order, Product } from '@/types';

// ======= إعدادات الفيسبوك =======
// للحصول على معرف صفحة الفيسبوك:
// 1. افتح صفحتك على فيسبوك
// 2. انظر إلى عنوان URL، ستجد اسم المستخدم بعد facebook.com/
// مثال: facebook.com/mystore -> PAGE_USERNAME = 'mystore'
export const PAGE_USERNAME = import.meta.env.VITE_FB_PAGE_USERNAME || 'YOUR_PAGE_USERNAME';

// للحصول على معرف Facebook Pixel:
// 1. افتح Facebook Business Manager: https://business.facebook.com
// 2. اذهب إلى Data Sources > Pixels
// 3. انقر على "Add New Pixel" أو اختر pixel موجود
// 4. انسخ معرف Pixel (رقم مكون من 16 خانة)
export const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || 'YOUR_PIXEL_ID';

export const generateFacebookPageLink = (order: Order, message: string): string => {
  const utmParams = new URLSearchParams({
    utm_source: 'store_website',
    utm_medium: 'order_message',
    utm_campaign: 'order_follow_up',
    order_id: order.id
  }).toString();
  
  return `https://www.facebook.com/${PAGE_USERNAME}?${utmParams}`;
};

export const generateProductLink = (product: Product): string => {
  const utmParams = new URLSearchParams({
    utm_source: 'store_website',
    utm_medium: 'product_link',
    utm_campaign: 'product_share',
    product_id: product.id
  }).toString();
  
  return `https://www.facebook.com/${PAGE_USERNAME}/shop/${product.id}?${utmParams}`;
};

// إضافة كود Facebook Pixel
export const initializeFacebookPixel = (): void => {
  // إضافة كود Facebook Pixel
  const pixelCode = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  
  // إضافة الكود إلى head
  const script = document.createElement('script');
  script.innerHTML = pixelCode;
  document.head.appendChild(script);
};

// تتبع حدث مشاهدة المنتج
export const trackProductView = (product: Product): void => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'LYD'
    });
  }
};

// تتبع حدث بدء الطلب
export const trackInitiateCheckout = (order: Order): void => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_ids: order.products.map(p => p.productId),
      value: order.totalPrice,
      currency: 'LYD'
    });
  }
};

// نافذة منبثقة تحتوي على تعليمات للعميل
export const showFacebookInstructions = (order: Order, message: string): string => {
  return `
    1. انتقل إلى صفحة المتجر على فيسبوك
    2. انقر على زر "مراسلة" أو "Message"
    3. انسخ والصق الرسالة التالية:
    
    ${message}
    
    معلومات الطلب:
    رقم الطلب: ${order.id}
    الاسم: ${order.customerName}
    رقم الهاتف: ${order.phone}
  `;
}; 