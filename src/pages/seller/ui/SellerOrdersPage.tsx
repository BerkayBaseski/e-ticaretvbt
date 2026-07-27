import React, { useState } from 'react';
import { SellerLayout } from './SellerLayout';
import { CheckCircle2, Search } from 'lucide-react';
import { mockOrders } from '../../../shared/api/mocks/mockData';
import { formatPrice } from '../../../shared/lib/utils';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { useToast } from '../../../shared/ui/Toast';

export const SellerOrdersPage: React.FC = () => {
  const { success } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');

  const handleUpdateStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'delivered' } : o))
    );
    success('Sipariş Güncellendi', 'Sipariş teslim edildi olarak işaretlendi.');
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="space-y-8 pb-12">
        <div className="border-b border-[#1F2937] pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Müşteri Siparişleri Yönetimi</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Mağazanıza verilen <span className="font-semibold text-white">{filteredOrders.length} siparişi</span> hazırlayın ve kargolayın.
          </p>
        </div>

        <div className="max-w-md">
          <Input
            placeholder="Sipariş no veya alıcı adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#CBD5E1]" />}
          />
        </div>

        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div key={ord.id} className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-4 text-xs">
                <div>
                  <span className="text-[#CBD5E1]">Sipariş Kodu:</span>{' '}
                  <span className="font-bold text-white ml-1">{ord.orderNumber}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#CBD5E1]">{new Date(ord.createdAt).toLocaleDateString('tr-TR')}</span>
                  {ord.status === 'delivered' ? (
                    <Badge variant="success">Teslim Edildi</Badge>
                  ) : (
                    <Badge variant="default">Kargoda</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Sipariş Verilen Ürünler</h4>
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-[#1F2937]">
                      <img src={item.productImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-black" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{item.productName}</p>
                        <p className="text-[11px] text-[#CBD5E1]">{item.quantity} Adet x {formatPrice(item.unitPrice)}</p>
                      </div>
                      <span className="font-extrabold text-white">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-black/30 border border-[#1F2937] p-4 space-y-3">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Teslimat Adresi</h4>
                  <div className="text-[#CBD5E1] space-y-0.5 text-[11px]">
                    <p className="font-bold text-white">{ord.shippingAddress.fullName}</p>
                    <p>{ord.shippingAddress.addressLine1}</p>
                    <p>{ord.shippingAddress.state} / {ord.shippingAddress.city}</p>
                    <p>{ord.shippingAddress.phone}</p>
                  </div>

                  <div className="pt-2 border-t border-[#1F2937]">
                    {ord.status !== 'delivered' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(ord.id)}
                        className="w-full rounded-xl text-xs gap-1.5 font-bold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Teslim Edildi İşaretle
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
};
