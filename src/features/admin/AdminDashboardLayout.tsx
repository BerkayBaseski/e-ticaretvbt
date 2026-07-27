import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, Tag, Settings, ArrowLeft } from 'lucide-react';

export const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Genel Bakış & Analitik', path: '/admin', icon: LayoutDashboard },
    { name: 'Sipariş Yönetimi', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Ürün Kataloğu', path: '/admin/products', icon: Package },
    { name: 'Müşteriler', path: '/admin/customers', icon: Users },
    { name: 'İndirim & Kuponlar', path: '/admin/discounts', icon: Tag },
    { name: 'Sistem Ayarları', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#1F2937] bg-[#0B1220] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center font-black">
                N
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">Nova Admin</span>
            </Link>

            <Link to="/" className="text-xs text-[#CBD5E1] hover:text-white flex items-center gap-1" title="Mağazaya Dön">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-md'
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

        <div className="pt-4 border-t border-[#1F2937] text-[11px] text-[#94A3B8]">
          <p className="font-bold text-white">NovaStore Commerce OS v2.4</p>
          <p>Production Analytics Engine</p>
        </div>
      </aside>

      {/* Main Admin Content Slot */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
