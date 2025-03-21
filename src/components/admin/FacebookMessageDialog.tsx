import React, { useState } from 'react';
import { Order } from '@/types';
import { generateFacebookPageLink, showFacebookInstructions } from '@/lib/facebook';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FacebookMessageDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const FacebookMessageDialog: React.FC<FacebookMessageDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [message, setMessage] = useState('');

  const handleCopyMessage = () => {
    const instructions = showFacebookInstructions(order, message);
    navigator.clipboard.writeText(instructions).then(() => {
      toast({
        title: "تم النسخ",
        description: "تم نسخ الرسالة إلى الحافظة",
      });
    });
  };

  const handleOpenFacebookPage = () => {
    const pageLink = generateFacebookPageLink(order, message);
    window.open(pageLink, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            إرسال رسالة عبر Facebook
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">معلومات العميل:</p>
            <div className="text-sm text-muted-foreground">
              <p>الاسم: {order.customerName}</p>
              <p>رقم الطلب: {order.id}</p>
              <p>الهاتف: {order.phone}</p>
              <p>العنوان: {order.city} - {order.address}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              نص الرسالة
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="h-32"
              dir="rtl"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg space-y-2">
            <p className="text-sm font-medium">خطوات إرسال الرسالة:</p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>انقر على زر "نسخ الرسالة" أدناه</li>
              <li>انقر على زر "فتح صفحة Facebook"</li>
              <li>في صفحة Facebook، انقر على زر "مراسلة"</li>
              <li>الصق الرسالة في نافذة المحادثة</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleCopyMessage}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            نسخ الرسالة
          </Button>
          <Button 
            onClick={handleOpenFacebookPage}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            فتح صفحة Facebook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FacebookMessageDialog; 