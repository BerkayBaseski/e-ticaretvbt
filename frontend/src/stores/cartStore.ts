import { create } from 'zustand';
import type { Cart, Product, CouponValidationResult } from '../api/types';
import { cartApi, couponsApi } from '../api';

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<CouponValidationResult>;
  removeCoupon: () => void;
  clearCart: () => void;
  recalculateTotals: (items: any[], coupon?: CouponValidationResult) => void;
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

  recalculateTotals: (items, appliedCoupon) => {
    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    let shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49.99;
    let discount = 0;

    if (appliedCoupon?.valid) {
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        discount = subtotal * ((appliedCoupon.discountAmount || 0) / 100);
      } else if (appliedCoupon.discountType === 'FIXED') {
        discount = appliedCoupon.discountAmount || 0;
      } else if (appliedCoupon.discountType === 'FREE_SHIPPING') {
        shipping = 0;
      }
    }

    const total = Math.max(0, subtotal + shipping - discount);

    set((state) => ({
      cart: {
        ...state.cart,
        items,
        subtotal,
        shipping,
        discount,
        total,
        totalItems,
        appliedCoupon
      }
    }));
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cartData = await cartApi.getCart();
      const currentCoupon = get().cart.appliedCoupon;
      get().recalculateTotals(cartData.items, currentCoupon);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Sepet bilgisi yüklenemedi', isLoading: false });
    }
  },

  addToCart: async (product: Product, quantity = 1) => {
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

    get().recalculateTotals(newItems, currentCart.appliedCoupon);

    try {
      await cartApi.addItem(product.id, quantity);
      // Backend update is fired asynchronously, local state represents truth
    } catch (err: any) {
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
            totalPrice: quantity * i.unitPrice,
          };
        }
        return i;
      });
    }

    get().recalculateTotals(newItems, currentCart.appliedCoupon);

    try {
      if (quantity <= 0) {
        await cartApi.removeItem(cartItemId);
      } else {
        await cartApi.updateQuantity(cartItemId, quantity);
      }
    } catch (err: any) {
      set({ cart: currentCart, error: err.message || 'Güncelleme başarısız' });
    }
  },

  removeItem: async (cartItemId: string) => {
    const currentCart = get().cart;
    const newItems = currentCart.items.filter((i) => i.id !== cartItemId && i.productId !== cartItemId);
    
    get().recalculateTotals(newItems, currentCart.appliedCoupon);

    try {
      await cartApi.removeItem(cartItemId);
    } catch (err: any) {
      set({ cart: currentCart, error: err.message || 'Silme başarısız' });
    }
  },

  applyCoupon: async (code: string) => {
    const { cart } = get();
    try {
      const result = await couponsApi.validateCoupon(code, cart.subtotal);
      if (result.valid) {
        get().recalculateTotals(cart.items, result);
      }
      return result;
    } catch (err: any) {
      return { valid: false, message: 'Kupon doğrulama hatası.' };
    }
  },

  removeCoupon: () => {
    get().recalculateTotals(get().cart.items, undefined);
  },

  clearCart: () => {
    set({ cart: initialCart });
  },
}));
