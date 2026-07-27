import { create } from 'zustand';
import type { Product } from '../api/types';

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: JSON.parse(localStorage.getItem('wishlist_items') || '[]'),

  toggleWishlist: (product: Product) => {
    const current = get().wishlist;
    const exists = current.some((p) => p.id === product.id);
    let updated: Product[];

    if (exists) {
      updated = current.filter((p) => p.id !== product.id);
    } else {
      updated = [...current, product];
    }

    localStorage.setItem('wishlist_items', JSON.stringify(updated));
    set({ wishlist: updated });
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.some((p) => p.id === productId);
  },
}));
