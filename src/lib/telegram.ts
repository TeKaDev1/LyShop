/**
 * Utility functions for sending Telegram notifications
 */

// Telegram Bot token provided by the user
const TELEGRAM_BOT_TOKEN = '8158941774:AAE7PI_LmY_Dn-0ZYphvgI-X87NBpJJbyf4';

/**
 * Sends a message to a customer via Telegram
 * @param phoneNumber The customer's phone number (used as chat ID)
 * @param message The message to send
 * @returns Promise that resolves when the message is sent
 */
export const sendTelegramMessage = async (phoneNumber: string, message: string): Promise<boolean> => {
  try {
    // In a real-world scenario, you would need to map phone numbers to Telegram chat IDs
    // For simplicity, we're using the phone number as the chat ID here
    // In production, you would need a proper mapping system or user registration process
    
    // Ensure we're working with the user's original phone number
    if (!phoneNumber) {
      console.error('Phone number is missing or invalid');
      return false;
    }
    
    // Format the phone number with Libyan country code (+218)
    let chatId = phoneNumber.replace(/\D/g, '');
    
    // If the number doesn't start with 218, add it
    if (!chatId.startsWith('218')) {
      // Remove leading zeros if present
      chatId = chatId.replace(/^0+/, '');
      chatId = '218' + chatId;
    }
    
    console.log(`Sending Telegram message to phone number: ${phoneNumber} (formatted as: ${chatId})`);
    
    // Telegram Bot API endpoint for sending messages
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // Send the message using the Fetch API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Allows for basic formatting
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('Failed to send Telegram message:', data.description);
      return false;
    }
    
    console.log('Telegram message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

/**
 * Sends an order processing notification to a customer
 * @param orderDetails The order details
 * @returns Promise that resolves when the notification is sent
 */
export const sendOrderProcessingNotification = async (orderDetails: {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
}): Promise<boolean> => {
  const message = `
<b>إشعار طلب رقم: #${orderDetails.id}</b>

<b>مرحباً ${orderDetails.customerName}!</b>

نود إعلامك بأن طلبك رقم <b>#${orderDetails.id}</b> قيد المعالجة الآن.

<b>تفاصيل الطلب:</b>
- رقم الطلب: #${orderDetails.id}
- المبلغ الإجمالي: ${orderDetails.totalPrice.toFixed(2)} د.ل

سنقوم بإعلامك عندما يتم شحن طلبك.

شكراً لتسوقك معنا!
فريق خدمة العملاء
  `;
  
  return sendTelegramMessage(orderDetails.phone, message);
};

/**
 * Sends an order status notification to a customer
 * @param phoneNumber The customer's phone number
 * @param orderId The order ID
 * @param status The new order status
 * @returns Promise that resolves when the notification is sent
 */
export const sendOrderStatusNotification = async (
  phoneNumber: string,
  orderId: string,
  status: string
): Promise<boolean> => {
  // Get the status message in Arabic
  let statusMessage = '';
  switch (status) {
    case 'processing':
      statusMessage = 'قيد المعالجة';
      break;
    case 'shipped':
      statusMessage = 'تم الشحن';
      break;
    case 'delivered':
      statusMessage = 'تم التسليم';
      break;
    case 'suspended':
      statusMessage = 'موقوف';
      break;
    default:
      statusMessage = 'معلق';
  }

  const message = `
<b>تحديث حالة الطلب رقم: #${orderId}</b>

نود إعلامك بأن حالة طلبك قد تم تحديثها إلى: <b>${statusMessage}</b>

يمكنك التواصل معنا في حال وجود أي استفسار.

شكراً لتسوقك معنا!
فريق خدمة العملاء
  `;
  
  return sendTelegramMessage(phoneNumber, message);
};

/**
 * Sends a custom message to a customer via Telegram
 * @param phoneNumber The customer's phone number
 * @param customMessage The custom message to send
 * @param orderInfo Optional order information to include in the message
 * @returns Promise that resolves when the message is sent
 */
export const sendCustomTelegramMessage = async (
  phoneNumber: string,
  customMessage: string,
  orderInfo?: {
    id: string;
    customerName: string;
  }
): Promise<boolean> => {
  let formattedMessage = customMessage;
  
  // If order info is provided, add a header with order details
  if (orderInfo) {
    formattedMessage = `
<b>رسالة بخصوص الطلب رقم: #${orderInfo.id}</b>
<b>العميل: ${orderInfo.customerName}</b>

${customMessage}

فريق خدمة العملاء
    `;
  }
  
  return sendTelegramMessage(phoneNumber, formattedMessage);
};

/**
 * Generates a WhatsApp link for sending a custom message to a customer
 * @param phoneNumber The customer's phone number
 * @param customMessage The custom message to send
 * @param orderInfo Optional order information to include in the message
 * @returns WhatsApp URL that can be opened to send the message
 */
export const generateCustomWhatsAppLink = (
  phoneNumber: string,
  customMessage: string,
  orderInfo?: {
    id: string;
    customerName: string;
  }
): string => {
  let formattedMessage = customMessage;
  
  // If order info is provided, add a header with order details
  if (orderInfo) {
    formattedMessage = `
*رسالة بخصوص الطلب رقم: #${orderInfo.id}*
*العميل: ${orderInfo.customerName}*

${customMessage}

فريق خدمة العملاء
    `;
  }
  
  // Format the phone number for WhatsApp
  // Remove any non-digit characters
  let formattedPhone = phoneNumber.replace(/\D/g, '');
  
  // If the number doesn't start with country code (218 for Libya), add it
  if (!formattedPhone.startsWith('218')) {
    // Remove leading zeros if present
    formattedPhone = formattedPhone.replace(/^0+/, '');
    formattedPhone = '218' + formattedPhone;
  }
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(formattedMessage);
  
  // Return the WhatsApp URL
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};