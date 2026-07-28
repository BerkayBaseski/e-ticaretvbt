import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { ordersApi } from '../../../shared/api';
import { formatPrice } from '../../../shared/lib/utils';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';

export const OrdersListPage: React.FC = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders-list'],
    queryFn: ordersApi.getOrders,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="Geçmiş Siparişiniz Bulunmuyor"
          description="Henüz verilmiş bir siparişiniz bulunmamaktadır."
          actionText="Alışverişe Başla"
          onAction={() => (window.location.href = '/search')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-[#1F2937] pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Sipariş Geçmişim</h1>
        <p className="text-xs text-[#CBD5E1] mt-0.5">Tüm siparişlerinizi ve kargo durumlarını takip edin.</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-4 text-xs">
              <div>
                <span className="text-[#CBD5E1]">Sipariş No:</span>{' '}
                <span className="font-bold text-white ml-1">{ord.orderNumber}</span>
              </div>
              <div className="flex items-center gap-4 text-[#CBD5E1]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#3B82F6]" /> {new Date(ord.createdAt).toLocaleDateString('tr-TR')}
                </span>
                <span className="font-extrabold text-white text-sm">{formatPrice(ord.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {ord.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-[#1F2937]"
                  />
                ))}
              </div>

              <Link
                to={`/orders/${ord.id}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#1F2937] bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1 transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-[#3B82F6]" /> Detay & Takip <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
