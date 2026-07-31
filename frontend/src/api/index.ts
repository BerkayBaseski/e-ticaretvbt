import { apiClient } from './client';
import type {
  AuthResponse,
  Cart,
  Category,
  Order,
  Product,
  ProductFilterParams,
  ProductsResponse,
  User,
  Banner,
  Coupon,
  CouponValidationResult,
  AdminStats
} from './types';

// AUTH APIs
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', userData);
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const res = await apiClient.post('/auth/refresh', { refreshToken });
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/users/me');
    return res.data;
  },

  updateMe: async (userData: Partial<User>): Promise<User> => {
    const res = await apiClient.patch<User>('/users/me', userData);
    return res.data;
  },
};

// PRODUCTS & CATEGORIES APIs
export const productsApi = {
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<Category[]>('/categories');
    return res.data;
  },

  getProducts: async (params: ProductFilterParams = {}): Promise<ProductsResponse> => {
    const res = await apiClient.get<ProductsResponse>('/products', { params });
    return res.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await apiClient.get<Product>(`/products/${id}`);
    return res.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get<Product[]>('/products/featured');
    return res.data;
  },

  getBestsellers: async (): Promise<Product[]> => {
    const res = await apiClient.get<Product[]>('/products/bestsellers');
    return res.data;
  },

  getNewArrivals: async (): Promise<Product[]> => {
    const res = await apiClient.get<Product[]>('/products/new-arrivals');
    return res.data;
  },

  getRelatedProducts: async (id: string): Promise<Product[]> => {
    const res = await apiClient.get<Product[]>(`/products/${id}/related`);
    return res.data;
  },

  getBrands: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('/products/brands');
    return res.data;
  },
};

// CART APIs
export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get<Cart>('/cart');
    return res.data;
  },

  addItem: async (productId: string, quantity: number = 1): Promise<Cart> => {
    const res = await apiClient.post<Cart>('/cart/items', { productId, quantity });
    return res.data;
  },

  updateQuantity: async (cartItemId: string, quantity: number): Promise<Cart> => {
    const res = await apiClient.patch<Cart>(`/cart/items/${cartItemId}`, { quantity });
    return res.data;
  },

  removeItem: async (cartItemId: string): Promise<Cart> => {
    const res = await apiClient.delete<Cart>(`/cart/items/${cartItemId}`);
    return res.data;
  },
};

// ORDERS APIs
export const ordersApi = {
  createOrder: async (orderData: {
    shippingAddress: any;
    paymentDetails: any;
  }): Promise<Order> => {
    const res = await apiClient.post<Order>('/orders', orderData);
    return res.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const res = await apiClient.get<Order[]>('/orders');
    return res.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await apiClient.get<Order>(`/orders/${id}`);
    return res.data;
  },
};

// BANNERS APIs
export const bannersApi = {
  getBanners: async (position?: string): Promise<Banner[]> => {
    const res = await apiClient.get<Banner[]>('/banners', { params: { position } });
    return res.data;
  }
};

// COUPONS APIs
export const couponsApi = {
  getActiveCoupons: async (): Promise<Coupon[]> => {
    const res = await apiClient.get<Coupon[]>('/coupons/active');
    return res.data;
  },
  
  validateCoupon: async (code: string, orderAmount: number): Promise<CouponValidationResult> => {
    const res = await apiClient.post<CouponValidationResult>('/coupons/validate', { code, orderAmount });
    return res.data;
  }
};

// ADMIN APIs
export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>('/admin/stats');
    return res.data;
  },
  
  getRecentOrders: async (): Promise<Order[]> => {
    const res = await apiClient.get<Order[]>('/admin/recent-orders');
    return res.data;
  }
};
