export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  video?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  customerName: string;
  city: string;
  address: string;
  phone: string;
  products: { productId: string; quantity: number }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'suspended';
  date: string;
  hasWishlist?: boolean;
  notes?: string;
}

export type CreateOrderData = Omit<Order, 'id' | 'status' | 'date'>;

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  areas?: string[];
  cities?: string[];
}

export interface AdminCredentials {
  username: string;
  password?: string;
  hashedPassword?: string;
  salt?: string;
}

export interface WishlistItem {
  userId: string;
  productIds: string[];
} 