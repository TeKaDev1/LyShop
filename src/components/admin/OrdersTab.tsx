import React, { useState } from 'react';
import { Order } from '@/types';
import { updateOrderStatus, deleteOrder } from '@/lib/data';
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

type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'suspended';

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
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  // Status options for the dropdown
  const statusOptions: Array<{
    value: OrderStatus;
    label: string;
    color: string;
  }> = [
    { value: 'pending', label: 'قيد المراجعة', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' },
    { value: 'processing', label: 'قيد التجهيز', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { value: 'shipping', label: 'جاري الشحن', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { value: 'delivered', label: 'تم التوصيل', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { value: 'suspended', label: 'معلق', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
  ];

  // Function to get status color based on status value
  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  // Function to get status label based on status value
  const getStatusLabel = (status: string): string => {
    const statusLabels = {
      pending: 'قيد المراجعة',
      processing: 'قيد التجهيز',
      shipping: 'جاري الشحن',
      delivered: 'تم التوصيل',
      suspended: 'معلق'
    };
    return statusLabels[status] || status;
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
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const success = await deleteOrder(selectedOrder.id);
      
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
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      setIsUpdating(true);
      
      // Update order status
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      if (!updatedOrder) {
        toast({
          title: "خطأ",
          description: "فشل تحديث حالة الطلب",
          variant: "destructive"
        });
        return;
      }

      // Send Telegram notification
      try {
        if (newStatus === 'processing') {
          await sendOrderProcessingNotification(updatedOrder);
        } else {
          await sendOrderStatusNotification(
            updatedOrder.phone,
            orderId,
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
      
      toast({
        title: "تم تحديث الحالة",
        description: `تم تغيير حالة الطلب إلى "${getStatusLabel(newStatus)}"`,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">جميع الطلبات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="processing">قيد التجهيز</option>
          <option value="shipping">جاري الشحن</option>
          <option value="delivered">تم التوصيل</option>
          <option value="suspended">معلق</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{order.customerName}</h3>
                <p className="text-muted-foreground">{order.phone}</p>
                <p className="text-muted-foreground">{order.city} - {order.address}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                className="px-3 py-1 border rounded"
              >
                <option value="pending">قيد المراجعة</option>
                <option value="processing">قيد التجهيز</option>
                <option value="shipping">جاري الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="suspended">معلق</option>
              </select>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">المنتجات:</h4>
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span>{item.productId}</span>
                  <span>الكمية: {item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenMessageDialog(order)}
                >
                  <MessageCircle className="h-4 w-4 ml-2" />
                  تيليجرام
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(generateCustomWhatsAppLink(order.phone, ''), '_blank')}
                >
                  <ExternalLink className="h-4 w-4 ml-2" />
                  واتساب
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDeleteDialog(order)}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
              
              <span className="text-muted-foreground">{order.date}</span>
            </div>
          </div>
        ))}
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

      {/* Facebook Message Dialog */}
    </div>
  );
};

export default OrdersTab;
