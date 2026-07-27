import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User as UserIcon, LogOut, Package, Heart, Bell, ChevronDown, Menu, X, Tag } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const categoriesList = [
    { name: 'Elektronik', slug: 'cat-1', desc: 'Kulaklıklar, akıllı saatler ve aksesuarlar' },
    { name: 'Giyim & Moda', slug: 'cat-2', desc: 'Sokak modası, tişörtler ve montlar' },
    { name: 'Ev & Yaşam', slug: 'cat-3', desc: 'Dekorasyon, aydınlatma ve mobilya' },
    { name: 'Spor & Outdoor', slug: 'cat-4', desc: 'Mataralar, kamp ve antrenman setleri' },
    { name: 'Aksesuar & Saat', slug: 'cat-5', desc: 'Lüks saatler, takılar ve gözlükler' },
  ];

  const notifications = [
    { id: 1, title: 'Yaz Fırsatları Başladı', text: 'Tüm elektronik ürünlerde %20 sepette indirim.', time: '10 dk önce' },
    { id: 2, title: 'Kargo Bildirimi', text: 'Siparişiniz kargoya verilmek üzere hazırlandı.', time: '2 saat önce' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2937] bg-[#030712]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Category Dropdown */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight leading-none text-[#F8FAFC]">
                  Nova<span className="text-[#3B82F6]">Store</span>
                </span>
                <span className="text-[9px] text-[#CBD5E1] font-medium tracking-widest uppercase">Luxury Commerce</span>
              </div>
            </Link>

            {/* Desktop Category Menu Trigger */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-all"
              >
                <Tag className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Kategoriler</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoryMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-72 rounded-2xl border border-[#1F2937] bg-[#111827] text-[#F8FAFC] shadow-2xl p-2 z-20"
                    >
                      {categoriesList.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/search?category=${cat.slug}`}
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-xs font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-[#CBD5E1] leading-tight mt-0.5">
                            {cat.desc}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Premium ürün, marka veya model ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#111827]/70 border border-[#1F2937] rounded-full text-xs text-[#F8FAFC] placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-[#111827] transition-all"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#CBD5E1]/60 pointer-events-none" />
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle />

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-full text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Bildirimler"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-[#030712]" />
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#1F2937] bg-[#111827] text-[#F8FAFC] shadow-2xl p-4 z-20 space-y-3"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">Bildirimler</h4>
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-xl bg-black/30 border border-[#1F2937] space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white">{n.title}</span>
                              <span className="text-[10px] text-[#CBD5E1]">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Link */}
            <Link to="/search" className="relative p-2 rounded-full text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Link */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-[#CBD5E1] hover:text-white" aria-label="Sepet">
                <ShoppingBag className="w-5 h-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#2563EB] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth / Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 text-[#3B82F6] font-bold flex items-center justify-center text-xs border border-[#2563EB]/40">
                    {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[90px] truncate text-[#F8FAFC]">
                    {user.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl z-20 py-2 text-[#F8FAFC]"
                      >
                        <div className="px-4 py-2 border-b border-[#1F2937]">
                          <p className="text-xs font-bold truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] text-[#CBD5E1] truncate">{user.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#3B82F6]" /> Profilim & Adres
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#3B82F6]" /> Siparişlerim
                        </Link>

                        <div className="border-t border-[#1F2937] mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                              navigate('/');
                            }}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 w-full text-left transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" /> Çıkış Yap
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="text-xs rounded-full">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#1F2937] space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Ürün veya kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#111827] border border-[#1F2937] rounded-full text-xs text-[#F8FAFC]"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#CBD5E1]" />
              </div>
            </form>

            <nav className="flex flex-col space-y-1 text-xs">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 font-medium rounded-xl hover:bg-white/5"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 font-medium rounded-xl hover:bg-white/5"
              >
                Tüm Ürünler & Arama
              </Link>
              {categoriesList.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/search?category=${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-1.5 text-[#CBD5E1] hover:text-white pl-6"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
