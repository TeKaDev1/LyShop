import React, { useState } from 'react';
import { Order, updateOrderStatus, deleteOrder } from '@/lib/data';
import {
  sendOrderProcessingNotification,
  sendOrderStatusNotification,
  sendCustomTelegramMessage,
  generateCustomWhatsAppLink
} from '@/lib/telegram';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, MessageCircle, ExternalLink, Trash2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface OrdersTabProps {
  orders: Order[];
  refreshOrders: () => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, refreshOrders }) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  // Status options for the dropdown
  const statusOptions: Array<{
    value: Order['status'];
    label: string;
    color: string;
  }> = [
    { value: 'pending', label: 'معلق', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' },
    { value: 'processing', label: 'قيد المعالجة', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { value: 'shipped', label: 'تم الشحن', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { value: 'delivered', label: 'تم التسليم', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { value: 'suspended', label: 'موقوف', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
  ];

  // Function to get status color based on status value
  const getStatusColor = (status: Order['status']) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  // Function to get status label based on status value
  const getStatusLabel = (status: Order['status']) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.label || status;
  };

  // Handle opening the message dialog
  const handleOpenMessageDialog = (order: Order) => {
    setSelectedOrder(order);
    setCustomMessage(''); // Reset message input
    setIsMessageDialogOpen(true);
  };

  // Handle opening the delete dialog
  const handleOpenDeleteDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete order
  const handleDeleteOrder = () => {
    if (!selectedOrder) return;
    
    try {
      const success = deleteOrder(selectedOrder.id);
      
      if (success) {
        toast({
          title: "تم حذف الطلب",
          description: `تم حذف الطلب رقم ${selectedOrder.id} بنجاح`,
        });
        
        // Refresh orders list
        refreshOrders();
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الطلب",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الطلب",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Generate WhatsApp link for custom message
  const handleSendCustomMessage = () => {
    if (!selectedOrder || !customMessage.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رسالة",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate WhatsApp link
      const whatsappLink = generateCustomWhatsAppLink(
        selectedOrder.phone,
        customMessage,
        {
          id: selectedOrder.id,
          customerName: selectedOrder.customerName
        }
      );
      
      // Open WhatsApp in a new tab
      window.open(whatsappLink, '_blank');
      
      toast({
        title: "تم فتح واتساب",
        description: "تم فتح واتساب لإرسال الرسالة المخصصة إلى العميل",
      });
      
      setIsMessageDialogOpen(false);
    } catch (error) {
      console.error("Error generating WhatsApp link:", error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء رابط واتساب",
        variant: "destructive"
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: string, order: Order) => {
    try {
      setIsUpdating(true);
      
      // Validate status before updating
      if (!['pending', 'processing', 'shipped', 'delivered', 'suspended'].includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }
      
      // Update order status
      const updatedOrder = updateOrderStatus(
        orderId,
        newStatus as Order['status']
      );
      
      if (!updatedOrder) {
        toast({
          title: "خطأ",
          description: "فشل تحديث حالة الطلب",
          variant: "destructive"
        });
        return;
      }
      
      // Send Telegram notification for any status change
      try {
        if (newStatus === 'processing') {
          // For processing status, use the detailed notification
          await sendOrderProcessingNotification({
            id: order.id,
            customerName: order.customerName,
            phone: order.phone,
            totalPrice: order.totalPrice
          });
        } else {
          // For other statuses, use the generic status notification
          await sendOrderStatusNotification(
            order.phone,
            order.id,
            newStatus
          );
        }
        
        toast({
          title: "تم إرسال الإشعار",
          description: "تم إرسال إشعار إلى العميل عبر تيليجرام",
        });
      } catch (error) {
        console.error("Error sending Telegram notification:", error);
        toast({
          title: "تنبيه",
          description: "تم تحديث الحالة ولكن فشل إرسال الإشعار",
          variant: "destructive"
        });
      }
      
      // Refresh orders list
      refreshOrders();
      
      toast({
        title: "تم تحديث الحالة",
        description: `تم تغيير حالة الطلب إلى "${getStatusLabel(newStatus as Order['status'])}"`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">الطلبات</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowRight size={18} className="ml-2" />
          <span>العودة</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">رقم الطلب</th>
                  <th className="text-right py-3 px-4">العميل</th>
                  <th className="text-right py-3 px-4">المدينة</th>
                  <th className="text-right py-3 px-4">رقم الهاتف</th>
                  <th className="text-right py-3 px-4">المبلغ</th>
                  <th className="text-right py-3 px-4">الحالة</th>
                  <th className="text-right py-3 px-4">التاريخ</th>
                  <th className="text-right py-3 px-4">قائمة الرغبات</th>
                  <th className="text-right py-3 px-4">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.city}</td>
                    <td className="py-3 px-4">{order.phone}</td>
                    <td className="py-3 px-4">{order.totalPrice.toFixed(2)} د.ل</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          // Validate that the value is a valid status
                          const value = e.target.value;
                          if (['pending', 'processing', 'shipped', 'delivered', 'suspended'].includes(value)) {
                            handleStatusChange(order.id, value, order);
                          }
                        }}
                        disabled={isUpdating}
                        className={`px-2 py-1 rounded text-xs border ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4 text-center">
                      {order.hasWishlist ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full" title="العميل لديه منتجات في قائمة الرغبات">
                          <Heart size={16} />
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleOpenMessageDialog(order)}
                          className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                          title="إرسال رسالة واتساب مخصصة"
                        >
                          <MessageCircle size={16} className="ml-1" />
                          <span className="text-xs">واتساب</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteDialog(order)}
                          className="flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                          title="حذف الطلب"
                        >
                          <Trash2 size={16} className="ml-1" />
                          <span className="text-xs">حذف</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">لا توجد طلبات حالياً</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد حذف الطلب</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-right">
              <p className="text-sm font-medium">هل أنت متأكد من حذف هذا الطلب؟</p>
              <p className="text-sm">رقم الطلب: {selectedOrder.id}</p>
              <p className="text-sm">العميل: {selectedOrder.customerName}</p>
              <p className="text-sm">المبلغ: {selectedOrder.totalPrice.toFixed(2)} د.ل</p>
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="ml-2"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteOrder}
              className="flex items-center"
            >
              <Trash2 size={16} className="ml-2" />
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">إرسال رسالة واتساب مخصصة</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
              <p className="text-sm font-medium">العميل: {selectedOrder.customerName}</p>
              <p className="text-sm">رقم الطلب: {selectedOrder.id}</p>
              <p className="text-sm">رقم الهاتف: {selectedOrder.phone}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="custom-message" className="text-sm font-medium block text-right">
              الرسالة المخصصة
            </label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="min-h-[120px] text-right"
              dir="rtl"
            />
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsMessageDialogOpen(false)}
              className="ml-2"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleSendCustomMessage}
              disabled={!customMessage.trim()}
              className="flex items-center"
            >
              <ExternalLink size={16} className="ml-2" />
              فتح واتساب لإرسال الرسالة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersTab;
