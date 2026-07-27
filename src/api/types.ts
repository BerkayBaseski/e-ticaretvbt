export interface RFC9457Error {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
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
  tags: string[];
  specs?: Record<string, string>;
}

export interface ProductsResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  totalItems: number;
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

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardLastFour?: string;
  cardHolderName?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
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
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ProductFilterParams {
  page?: number;
  size?: number;
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
