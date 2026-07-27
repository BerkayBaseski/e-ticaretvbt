import { create } from 'zustand';
import type { Cart, Product } from '../api/types';
import { cartApi } from '../api';

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  totalItems: 0,
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: initialCart,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cartData = await cartApi.getCart();
      set({ cart: cartData, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Sepet bilgisi yüklenemedi', isLoading: false });
    }
  },

  addToCart: async (product: Product, quantity = 1) => {
    // Optimistic Update
    const currentCart = get().cart;
    const existingIndex = currentCart.items.findIndex((item) => item.productId === product.id);
    let newItems = [...currentCart.items];

    if (existingIndex > -1) {
      const existing = newItems[existingIndex];
      const newQty = existing.quantity + quantity;
      newItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: newQty * existing.unitPrice,
      };
    } else {
      newItems.push({
        id: `temp-${Date.now()}`,
        productId: product.id,
        product,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      });
    }

    const subtotal = newItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 49;
    const discount = subtotal > 2000 ? 150 : 0;
    const total = Math.max(0, subtotal + shipping - discount);

    set({
      cart: {
        items: newItems,
        subtotal,
        shipping,
        discount,
        total,
        totalItems,
      },
    });

    try {
      const updatedCart = await cartApi.addItem(product.id, quantity);
      set({ cart: updatedCart });
    } catch (err: any) {
      // Rollback on error
      set({ cart: currentCart, error: err.message || 'Sepete ekleme başarısız' });
    }
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    const currentCart = get().cart;
    let newItems = [...currentCart.items];

    if (quantity <= 0) {
      newItems = newItems.filter((i) => i.id !== cartItemId && i.productId !== cartItemId);
    } else {
      newItems = newItems.map((i) => {
        if (i.id === cartItemId || i.productId === cartItemId) {
          return {
            ...i,
            quantity,
            totalPrice: i.unitPrice * quantity,
          };
        }
        return i;
      });
    }

    const subtotal = newItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 49;
    const discount = subtotal > 2000 ? 150 : 0;
    const total = Math.max(0, subtotal + shipping - discount);

    set({
      cart: {
        items: newItems,
        subtotal,
        shipping,
        discount,
        total,
        totalItems,
      },
    });

    try {
      const updatedCart = await cartApi.updateQuantity(cartItemId, quantity);
      set({ cart: updatedCart });
    } catch (err: any) {
      set({ cart: currentCart, error: err.message || 'Sepet güncellenemedi' });
    }
  },

  removeItem: async (cartItemId: string) => {
    const currentCart = get().cart;
    const newItems = currentCart.items.filter((i) => i.id !== cartItemId && i.productId !== cartItemId);

    const subtotal = newItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 49;
    const discount = subtotal > 2000 ? 150 : 0;
    const total = Math.max(0, subtotal + shipping - discount);

    set({
      cart: {
        items: newItems,
        subtotal,
        shipping,
        discount,
        total,
        totalItems,
      },
    });

    try {
      const updatedCart = await cartApi.removeItem(cartItemId);
      set({ cart: updatedCart });
    } catch (err: any) {
      set({ cart: currentCart, error: err.message || 'Öğe silinemedi' });
    }
  },

  clearCart: () => {
    set({ cart: initialCart });
  },
}));
