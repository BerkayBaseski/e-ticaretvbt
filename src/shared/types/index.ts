export interface RFC9457Error {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  specs?: Record<string, string>;
  tags?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  currency: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentDetails: {
    method: 'credit_card' | 'bank_transfer' | 'cash_on_delivery' | string;
    cardLastFour?: string;
    cardHolderName?: string;
  };
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}
