import { create } from 'zustand';
import type { Product } from '../api/types';
import { mockProducts } from '../api/mocks/mockData';

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const getInitialWishlist = (): Product[] => {
  try {
    const stored1 = localStorage.getItem('user_wishlist');
    if (stored1) {
      const parsed = JSON.parse(stored1);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    const stored2 = localStorage.getItem('wishlist_items');
    if (stored2) {
      const parsed = JSON.parse(stored2);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse wishlist from localStorage', e);
  }

  // Default sample wishlist items if empty
  const defaultWishlist = [mockProducts[0], mockProducts[2]].filter(Boolean);
  try {
    localStorage.setItem('user_wishlist', JSON.stringify(defaultWishlist));
    localStorage.setItem('wishlist_items', JSON.stringify(defaultWishlist));
  } catch (e) {}

  return defaultWishlist;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: getInitialWishlist(),

  toggleWishlist: (product: Product) => {
    const current = get().wishlist;
    const exists = current.some((p) => p.id === product.id);
    let updated: Product[];

    if (exists) {
      updated = current.filter((p) => p.id !== product.id);
    } else {
      updated = [...current, product];
    }

    try {
      localStorage.setItem('user_wishlist', JSON.stringify(updated));
      localStorage.setItem('wishlist_items', JSON.stringify(updated));
    } catch (e) {}

    set({ wishlist: updated });
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.some((p) => p.id === productId);
  },

  clearWishlist: () => {
    try {
      localStorage.setItem('user_wishlist', JSON.stringify([]));
      localStorage.setItem('wishlist_items', JSON.stringify([]));
    } catch (e) {}
    set({ wishlist: [] });
  },
}));
