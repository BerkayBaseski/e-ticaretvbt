import React from 'react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockOrders, mockProducts } from '../../../shared/api/mocks/mockData';
import { formatPrice } from '../../../shared/lib/utils';

export const AdminAnalyticsPage: React.FC = () => {
  const stats = [
    { title: 'Toplam Ciro (Aylık)', value: '142,890 ₺', change: '+18.4%', isPositive: true, icon: DollarSign },
    { title: 'Sipariş Sayısı', value: '1,248', change: '+12.1%', isPositive: true, icon: ShoppingBag },
    { title: 'Aktif Müşteriler', value: '4,892', change: '+8.6%', isPositive: true, icon: Users },
    { title: 'Dönüşüm Oranı', value: '%3.42', change: '-0.4%', isPositive: false, icon: TrendingUp },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Yönetici Paneli & Analitik</h1>
            <p className="text-xs text-[#CBD5E1] mt-0.5">Mağaza performans göstergeleri ve canlı satış verileri</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
            Canlı Sistem Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
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
                  <span
                    className={`text-xs font-bold flex items-center ${
                      stat.isPositive ? 'text-[#22C55E]' : 'text-rose-500'
                    }`}
                  >
                    {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <h3 className="font-bold text-sm text-white">Haftalık Satış İstatistiği (Grafik)</h3>
            <span className="text-xs text-[#CBD5E1]">Son 7 Gün</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
            {[
              { day: 'Pzt', val: 40 },
              { day: 'Sal', val: 65 },
              { day: 'Çar', val: 50 },
              { day: 'Per', val: 85 },
              { day: 'Cum', val: 95 },
              { day: 'Cmt', val: 70 },
              { day: 'Paz', val: 90 },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  style={{ height: `${bar.val}%` }}
                  className="w-full max-w-[40px] rounded-t-xl bg-[#3B82F6] group-hover:bg-[#60A5FA] transition-all shadow-md"
                />
                <span className="text-[11px] font-semibold text-[#CBD5E1]">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">Son Siparişler</h3>
            <div className="space-y-3">
              {mockOrders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-black/30 border border-[#1F2937]">
                  <div>
                    <p className="font-bold text-white">{ord.orderNumber}</p>
                    <p className="text-[11px] text-[#CBD5E1]">{ord.shippingAddress.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#3B82F6]">{formatPrice(ord.totalAmount)}</p>
                    <span className="text-[10px] text-[#22C55E]">Teslim Edildi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">En Çok Satan Ürünler</h3>
            <div className="space-y-3">
              {mockProducts.slice(0, 3).map((prod) => (
                <div key={prod.id} className="flex items-center gap-3 text-xs p-3 rounded-xl bg-black/30 border border-[#1F2937]">
                  <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-black" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{prod.name}</p>
                    <p className="text-[11px] text-[#CBD5E1]">{prod.categoryName}</p>
                  </div>
                  <span className="font-extrabold text-white">{formatPrice(prod.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};
