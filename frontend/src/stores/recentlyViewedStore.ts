import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../api/types';

interface RecentlyViewedState {
  items: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addRecentlyViewed: (product: Product) => {
        set((state) => {
          // Remove existing instance of product if present
          const filtered = state.items.filter((p) => p.id !== product.id);
          // Prepend product, limit to 10 items
          const updated = [product, ...filtered].slice(0, 10);
          return { items: updated };
        });
      },
      clearRecentlyViewed: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
