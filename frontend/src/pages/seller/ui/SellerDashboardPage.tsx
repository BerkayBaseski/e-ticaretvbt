import React from 'react';
import { Link } from 'react-router-dom';
import { SellerLayout } from './SellerLayout';
import { DollarSign, ShoppingBag, Package, Star, AlertTriangle, ArrowUpRight, Plus, ChevronRight } from 'lucide-react';
import { mockOrders, mockProducts } from '../../../shared/api/mocks/mockData';
import { formatPrice } from '../../../shared/lib/utils';
import { Button } from '../../../shared/ui/Button';

export const SellerDashboardPage: React.FC = () => {
  const sellerStats = [
    { title: 'Aylık Mağaza Cirosu', value: '84,250 ₺', change: '+24.5%', isPositive: true, icon: DollarSign },
    { title: 'İşlenen Siparişler', value: '384 Adet', change: '+14.2%', isPositive: true, icon: ShoppingBag },
    { title: 'Yayındaki Ürünler', value: '18 Model', change: 'Stokta', isPositive: true, icon: Package },
    { title: 'Mağaza Puanı', value: '4.9 / 5.0', change: '98% Olumlu', isPositive: true, icon: Star },
  ];

  const lowStockProducts = mockProducts.filter((p) => p.stock <= 10);

  return (
    <SellerLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Satıcı Yönetim Paneli</h1>
            <p className="text-xs text-[#CBD5E1] mt-0.5">Mağaza performansınızı ve siparişlerinizi buradan yönetin.</p>
          </div>

          <Link to="/seller/products/new">
            <Button size="sm" className="gap-2 font-bold text-xs rounded-xl shadow-lg">
              <Plus className="w-4 h-4" /> Yeni Ürün Ekle
            </Button>
          </Link>
        </div>

        {/* 4 Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellerStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#CBD5E1]">{stat.title}</span>
                  <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                  <span className="text-xs font-bold text-[#22C55E] flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Warning Box */}
        {lowStockProducts.length > 0 && (
          <div className="rounded-[20px] border border-amber-500/30 bg-amber-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Stok Uyarısı</h4>
                <p className="text-xs text-[#CBD5E1]">
                  Mağazanızda <span className="font-bold text-amber-400">{lowStockProducts.length} ürünün</span> stoğu 10 adedin altına düştü.
                </p>
              </div>
            </div>

            <Link to="/seller/products">
              <Button variant="outline" size="sm" className="text-xs rounded-xl border-amber-500/40 text-amber-300 hover:bg-amber-500/20">
                Stokları Güncelle
              </Button>
            </Link>
          </div>
        )}

        {/* Sales Chart */}
        <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Haftalık Satış Grafiği</h3>
              <p className="text-xs text-[#CBD5E1]">Son 7 güne ait günlük sipariş tutarları</p>
            </div>
            <span className="text-xs text-[#3B82F6] font-semibold bg-[#3B82F6]/10 px-3 py-1 rounded-full border border-[#3B82F6]/30">
              Canlı Güncellendi
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2">
            {[
              { day: 'Pzt', amount: 8400 },
              { day: 'Sal', amount: 12100 },
              { day: 'Çar', amount: 9800 },
              { day: 'Per', amount: 15400 },
              { day: 'Cum', amount: 18900 },
              { day: 'Cmt', amount: 14200 },
              { day: 'Paz', amount: 16450 },
            ].map((b, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  style={{ height: `${(b.amount / 20000) * 100}%` }}
                  className="w-full max-w-[36px] rounded-t-xl bg-[#3B82F6] group-hover:bg-[#60A5FA] transition-all shadow-md"
                />
                <span className="text-[11px] font-semibold text-[#CBD5E1]">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders & Top Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h3 className="font-bold text-sm text-white">Son Müşteri Siparişleri</h3>
              <Link to="/seller/orders" className="text-xs text-[#3B82F6] hover:underline flex items-center gap-0.5">
                Tümünü Gör <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {mockOrders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-black/30 border border-[#1F2937]">
                  <div>
                    <p className="font-bold text-white">{ord.orderNumber}</p>
                    <p className="text-[11px] text-[#CBD5E1]">{ord.shippingAddress.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#3B82F6]">{formatPrice(ord.totalAmount)}</p>
                    <span className="text-[10px] text-[#22C55E] font-medium">Kargoya Verildi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h3 className="font-bold text-sm text-white">En Çok Satan Ürünleriniz</h3>
              <Link to="/seller/products" className="text-xs text-[#3B82F6] hover:underline flex items-center gap-0.5">
                Kataloğa Git <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {mockProducts.slice(0, 3).map((prod) => (
                <div key={prod.id} className="flex items-center gap-3 text-xs p-3 rounded-xl bg-black/30 border border-[#1F2937]">
                  <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-black" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{prod.name}</p>
                    <p className="text-[11px] text-[#CBD5E1]">Stok: {prod.stock} adet</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-white block">{formatPrice(prod.price)}</span>
                    <span className="text-[10px] text-amber-400 font-bold">★ {prod.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};
