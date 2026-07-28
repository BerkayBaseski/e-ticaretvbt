import { apiClient } from './client';
import type { Product, Category, Order, AuthResponse, PaginatedResponse } from '../types';

export const productsApi = {
  getProducts: async (params?: { category?: string; q?: string; sort?: string; page?: number; size?: number }) => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return data;
  },

  getProductById: async (id: string) => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  getCategories: async () => {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },
};

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: any) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    return data;
  },
};

export const ordersApi = {
  getOrders: async () => {
    const { data } = await apiClient.get<Order[]>('/orders');
    return data;
  },

  getOrderById: async (id: string) => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },

  createOrder: async (orderPayload: any) => {
    const { data } = await apiClient.post<Order>('/orders', orderPayload);
    return data;
  },
};
