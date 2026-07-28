import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = '₺'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency === '₺' ? 'TRY' : 'USD',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('TRY', '₺');
}

export function calculateDiscount(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
