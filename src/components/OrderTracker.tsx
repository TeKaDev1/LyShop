import { Clock, Package, Truck, CheckCircle, AlertCircle, Circle } from 'lucide-react';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        text: 'قيد المراجعة',
        description: 'طلبك قيد المراجعة من قبل فريقنا',
        icon: Clock
      };
    case 'processing':
      return {
        text: 'قيد التجهيز',
        description: 'جاري تجهيز طلبك في المستودع',
        icon: Package
      };
    case 'shipping':
      return {
        text: 'جاري الشحن',
        description: 'طلبك في الطريق إليك',
        icon: Truck
      };
    case 'delivered':
      return {
        text: 'تم التوصيل',
        description: 'تم توصيل طلبك بنجاح',
        icon: CheckCircle
      };
    case 'suspended':
      return {
        text: 'معلق',
        description: 'تم تعليق طلبك مؤقتاً',
        icon: AlertCircle
      };
    default:
      return {
        text: status,
        description: '',
        icon: Circle
      };
  }
}; 