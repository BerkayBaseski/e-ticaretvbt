import { create } from 'zustand';
import type { Product } from '../api/types';

interface CompareState {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareItems: JSON.parse(localStorage.getItem('compare_items') || '[]'),

  addToCompare: (product: Product) => {
    const current = get().compareItems;
    if (current.some((p) => p.id === product.id)) return;
    if (current.length >= 4) return; // Limit 4

    const updated = [...current, product];
    localStorage.setItem('compare_items', JSON.stringify(updated));
    set({ compareItems: updated });
  },

  removeFromCompare: (productId: string) => {
    const updated = get().compareItems.filter((p) => p.id !== productId);
    localStorage.setItem('compare_items', JSON.stringify(updated));
    set({ compareItems: updated });
  },

  clearCompare: () => {
    localStorage.removeItem('compare_items');
    set({ compareItems: [] });
  },

  isInCompare: (productId: string) => {
    return get().compareItems.some((p) => p.id === productId);
  },
}));
