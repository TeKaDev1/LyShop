export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  video?: string;
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

export interface Category {
  id: string;
  name: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  cities: string[];
  price: number;
}

export interface AdminCredentials {
  username: string;
  hashedPassword: string;
  salt: string;
} 