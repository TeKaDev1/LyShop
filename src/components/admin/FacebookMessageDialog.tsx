// This file has been intentionally emptied as part of removing Facebook integration
// to prevent errors related to Facebook Messenger functionality.

import React from 'react';
import { Order } from '@/types';

interface FacebookMessageDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

// Empty component that does nothing - kept to prevent import errors
const FacebookMessageDialog: React.FC<FacebookMessageDialogProps> = () => {
  return null;
};

export default FacebookMessageDialog;