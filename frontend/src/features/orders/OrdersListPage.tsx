import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Truck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ordersApi } from '../../api';
import type { OrderStatus } from '../../api/types';
import { formatPrice, formatDate } from '../../lib/utils';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const OrdersListPage: React.FC = () => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['orders-list'],
    queryFn: ordersApi.getOrders,
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="w-3 h-3" /> Hazırlanıyor
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="default" className="gap-1">
            <Truck className="w-3 h-3" /> Kargoda
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" /> Teslim Edildi
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="w-3 h-3" /> İptal Edildi
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Sipariş Geçmişim</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Tüm verdiğiniz siparişleri ve mevcut kargo durumlarını bu sayfadan takip edebilirsiniz.
        </p>
      </div>

      {isLoading && <TableRowSkeleton count={4} />}

      {isError && (
        <ErrorState
          title="Siparişler Alınamadı"
          message={(error as Error)?.message || 'Sipariş geçmişiniz yüklenirken bir sorun oluştu.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Henüz Siparişiniz Bulunmuyor"
          description="Sistemde henüz verilmiş herhangi bir sipariş kaydınız bulunmamaktadır."
          actionText="Alışverişe Başla"
          onAction={() => (window.location.href = '/search')}
        />
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-primary/40 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{order.orderNumber}</h3>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="font-extrabold text-base text-foreground">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Order Thumbnails */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {order.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-muted border border-border shrink-0"
                      title={item.productName}
                    />
                  ))}
                </div>

                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="gap-1 shrink-0">
                    Detaylar <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
