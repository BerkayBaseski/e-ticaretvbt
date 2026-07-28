import { create } from 'zustand';
import type { Cart, CartItem, Product } from '../../../shared/types';

interface CartState {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const initialCart: Cart = JSON.parse(
  localStorage.getItem('user_cart') ||
    JSON.stringify({ items: [], totalItems: 0, totalAmount: 0, currency: '₺' })
);

function calculateCartTotals(items: CartItem[]): { totalItems: number; totalAmount: number } {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  return { totalItems, totalAmount };
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: initialCart,

  addToCart: (product: Product, quantity = 1) => {
    const currentItems = get().cart.items;
    const existingIndex = currentItems.findIndex((i) => i.product.id === product.id);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [...currentItems, { id: `cart-${Date.now()}`, product, quantity }];
    }

    const { totalItems, totalAmount } = calculateCartTotals(updatedItems);
    const updatedCart: Cart = { ...get().cart, items: updatedItems, totalItems, totalAmount };

    localStorage.setItem('user_cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  removeFromCart: (productId: string) => {
    const updatedItems = get().cart.items.filter((i) => i.product.id !== productId);
    const { totalItems, totalAmount } = calculateCartTotals(updatedItems);
    const updatedCart: Cart = { ...get().cart, items: updatedItems, totalItems, totalAmount };

    localStorage.setItem('user_cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const updatedItems = get().cart.items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    const { totalItems, totalAmount } = calculateCartTotals(updatedItems);
    const updatedCart: Cart = { ...get().cart, items: updatedItems, totalItems, totalAmount };

    localStorage.setItem('user_cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  clearCart: () => {
    const emptyCart: Cart = { items: [], totalItems: 0, totalAmount: 0, currency: '₺' };
    localStorage.removeItem('user_cart');
    set({ cart: emptyCart });
  },
}));
