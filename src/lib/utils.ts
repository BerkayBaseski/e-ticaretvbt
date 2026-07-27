import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = '₺'): string {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 0,
  }).format(amount) + ' ' + currency;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateDiscount(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return discount > 0 ? discount : null;
}
