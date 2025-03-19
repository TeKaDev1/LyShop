import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'itzhapy@gmail.com';
const TEMPLATE_ID = 'template_f5rh7n9';
const PUBLIC_KEY = 'B6EzNeSIjQOTyWOLO';

interface OrderEmailData {
  customerName: string;
  city: string;
  address: string;
  phone: string;
  productDetails: string;
  totalPrice: number;
}

export const sendOrderEmail = async (data: OrderEmailData): Promise<boolean> => {
  try {
    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toLocaleDateString('ar-LY');
    const orderTime = new Date().toLocaleTimeString('ar-LY');
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: data.customerName,
        product_name: data.productDetails,
        product_price: `${data.totalPrice.toFixed(2)} د.ل`,
        customer_phone: data.phone,
        customer_address: `${data.city} - ${data.address}`,
        notes: "",
        reply_to: data.phone,
        // Original parameters for backward compatibility
        to_email: 'itzhapy@gmail.com',
        customer_name: data.customerName,
        city: data.city,
        address: data.address,
        phone: data.phone,
        product_details: data.productDetails,
        total_price: `${data.totalPrice.toFixed(2)} دينار ليبي`,
        order_id: orderId,
        order_date: orderDate,
        order_time: orderTime,
        store_name: 'ليبيا للتسوق',
        // Arabic email content - enhanced and simplified
        subject: 'طلب جديد من متجر ليبيا شوبر',
        greeting: `أهلاً ${data.customerName}،`,
        order_received: 'لقد تم استلام طلبك بنجاح!',
        order_details: 'بيانات الطلب:',
        customer_info: 'بيانات المشتري:',
        customer_name_label: 'الاسم:',
        city_label: 'المدينة:',
        address_label: 'العنوان:',
        phone_label: 'الهاتف:',
        products_label: 'المنتجات:',
        total_label: 'الإجمالي:',
        order_id_label: 'رقم الطلب:',
        order_date_label: 'التاريخ:',
        order_time_label: 'الوقت:',
        thank_you: 'شكراً لثقتك في متجر ليبيا شوبر',
        contact_us: 'للاستفسار يرجى التواصل معنا على الرقم 092-207-8595',
        footer: 'فريق ليبيا شوبر يتمنى لك تجربة تسوق ممتعة'
      },
      PUBLIC_KEY
    );

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

/**
 * HTML Template for Email (Copy this to your EmailJS template):
 *
 * <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
 *   <div style="text-align: center; margin-bottom: 20px; padding: 15px; background-color: #4a6cf7; border-radius: 8px;">
 *     <h1 style="color: #ffffff; margin: 0; font-size: 28px;">{{store_name}}</h1>
 *     <p style="color: #f0f0f0; font-size: 16px; margin-top: 5px;">{{subject}}</p>
 *   </div>
 *
 *   <div style="background-color: #f5f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #4a6cf7;">
 *     <h2 style="color: #333; margin-top: 0; font-size: 22px;">{{greeting}}</h2>
 *     <p style="color: #333; font-size: 18px; font-weight: 500;">{{order_received}}</p>
 *   </div>
 *
 *   <div style="margin-bottom: 25px; background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
 *     <h3 style="color: #4a6cf7; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; font-size: 20px;">{{order_details}}</h3>
 *
 *     <table style="width: 100%; border-collapse: collapse;">
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold; width: 40%;">{{order_id_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{order_id}}</td>
 *       </tr>
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold;">{{order_date_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{order_date}}</td>
 *       </tr>
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold;">{{order_time_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{order_time}}</td>
 *       </tr>
 *     </table>
 *   </div>
 *
 *   <div style="margin-bottom: 25px; background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
 *     <h3 style="color: #4a6cf7; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; font-size: 20px;">{{customer_info}}</h3>
 *
 *     <table style="width: 100%; border-collapse: collapse;">
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold; width: 40%;">{{customer_name_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{customer_name}}</td>
 *       </tr>
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold;">{{city_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{city}}</td>
 *       </tr>
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold;">{{address_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{address}}</td>
 *       </tr>
 *       <tr>
 *         <td style="padding: 10px 0; color: #555; font-weight: bold;">{{phone_label}}</td>
 *         <td style="padding: 10px 0; color: #333; font-weight: 500;">{{phone}}</td>
 *       </tr>
 *     </table>
 *   </div>
 *
 *   <div style="margin-bottom: 25px; background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
 *     <h3 style="color: #4a6cf7; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; font-size: 20px;">{{products_label}}</h3>
 *     <div style="background-color: #f5f8ff; padding: 15px; border-radius: 8px; margin-top: 10px;">
 *       <p style="margin: 0; white-space: pre-line; line-height: 1.6; font-size: 16px;">{{product_details}}</p>
 *     </div>
 *     <div style="text-align: left; margin-top: 20px; font-weight: bold; font-size: 20px; background-color: #f5f8ff; padding: 15px; border-radius: 8px; border-right: 4px solid #4a6cf7;">
 *       <span style="color: #555;">{{total_label}}</span>
 *       <span style="color: #4a6cf7; margin-right: 10px;">{{total_price}}</span>
 *     </div>
 *   </div>
 *
 *   <div style="background-color: #4a6cf7; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
 *     <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">{{thank_you}}</p>
 *     <p style="margin: 10px 0 0; color: #f0f0f0; font-size: 16px;">{{contact_us}}</p>
 *   </div>
 *
 *   <div style="text-align: center; margin-top: 25px; color: #777; font-size: 14px;">
 *     <p>{{footer}}</p>
 *   </div>
 * </div>
 */

/**
 * Updated EmailJS Template for Arabic Format:
 * 
 * {{from_name}},
 * 
 * ايصال طلب منتج جديد.
 * 
 * **اسم المنتج:** {{product_name}}
 * **سعر المنتج:** {{product_price}} د.ل
 * **رقم هاتف الزبون:** {{customer_phone}}
 * **عنوان الزبون:** {{customer_address}}
 * **ملاحظات:** {{notes}}
 * 
 * Please reply to: {{reply_to}}
 */
