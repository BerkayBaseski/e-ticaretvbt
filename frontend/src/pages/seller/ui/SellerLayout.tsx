import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Star,
  Store,
  ArrowLeft,
  DollarSign
} from 'lucide-react';

export const SellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Mağaza Paneli', path: '/seller', icon: LayoutDashboard },
    { name: 'Ürün Yönetimi', path: '/seller/products', icon: Package },
    { name: 'Yeni Ürün Ekle', path: '/seller/products/new', icon: PlusCircle },
    { name: 'Müşteri Siparişleri', path: '/seller/orders', icon: ShoppingBag },
    { name: 'Ürün Değerlendirmeleri', path: '/seller/reviews', icon: Star },
    { name: 'Mağaza Ayarları', path: '/seller/settings', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Seller Center Sidebar (Shopify Style) */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#1F2937] bg-[#0B1220] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <Link to="/seller" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-blue-700 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white">Nova Seller</span>
                <span className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
                  ● Mağaza Doğrulandı
                </span>
              </div>
            </Link>

            <Link to="/" className="text-xs text-[#CBD5E1] hover:text-white flex items-center gap-1" title="Müşteri Görünümü">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                      : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Store Performance Badge */}
        <div className="pt-4 border-t border-[#1F2937] space-y-2">
          <div className="p-3 rounded-xl bg-black/40 border border-[#1F2937] text-[11px] text-[#CBD5E1] space-y-1">
            <div className="flex justify-between font-bold text-white">
              <span>Bu Ayki Ciro</span>
              <span className="text-[#3B82F6] flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" /> 84,250 ₺
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">Shopify Seller Center Engine</p>
          </div>
        </div>
      </aside>

      {/* Main Seller Content View */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
