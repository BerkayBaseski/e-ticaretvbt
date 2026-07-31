import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Package, 
  Heart, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  Tag, 
  MapPin, 
  Sparkles, 
  Flame 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Location selector state
  const [selectedCity, setSelectedCity] = useState('İstanbul, Kadıköy');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const popularSearches = ['AuraSound Pro Kulaklık', 'Akıllı Saat', 'Organik Pamuk Tişört', 'Çalışma Koltuğu'];
  
  const mockSuggestions = [
    { id: 'prod-1', name: 'AuraSound Pro Gürültü Önleyici Kulaklık', category: 'Elektronik', price: '3,499 ₺', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80' },
    { id: 'prod-2', name: 'Nordic Minimalist Akıllı Saat Gen 4', category: 'Elektronik', price: '2,899 ₺', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80' },
    { id: 'prod-3', name: '%100 Organik Pamuk Oversize Tişört', category: 'Giyim & Moda', price: '499 ₺', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80' },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? mockSuggestions.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const categoriesList = [
    { name: 'Elektronik', slug: 'cat-1', desc: 'Kulaklıklar, akıllı saatler ve aksesuarlar' },
    { name: 'Giyim & Moda', slug: 'cat-2', desc: 'Sokak modası, tişörtler ve montlar' },
    { name: 'Ev & Yaşam', slug: 'cat-3', desc: 'Dekorasyon, aydınlatma ve mobilya' },
    { name: 'Spor & Outdoor', slug: 'cat-4', desc: 'Mataralar, kamp ve antrenman setleri' },
    { name: 'Aksesuar & Saat', slug: 'cat-5', desc: 'Lüks saatler, takılar ve gözlükler' },
  ];

  const citiesList = [
    'İstanbul, Kadıköy',
    'İstanbul, Beşiktaş',
    'Ankara, Çankaya',
    'İzmir, Karşıyaka',
    'Bursa, Nilüfer',
    'Antalya, Muratpaşa',
  ];

  const notifications = [
    { id: 1, title: 'Yaz Fırsatları Başladı', text: 'Tüm elektronik ürünlerde %20 sepette indirim.', time: '10 dk önce' },
    { id: 2, title: 'Kargo Bildirimi', text: 'Siparişiniz kargoya verilmek üzere hazırlandı.', time: '2 saat önce' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2937] bg-[#030712]/80 backdrop-blur-xl transition-all">
      {/* TOP DELIVERY BAR */}
      <div className="bg-[#0B1329] border-b border-[#1F2937] px-4 py-1.5 text-xs text-[#CBD5E1]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Teslimat Konumu:</span>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="font-bold text-white hover:text-[#3B82F6] transition-colors underline decoration-dashed"
            >
              {selectedCity}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="text-[#22C55E] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 1000 TL Üzeri Ücretsiz Kargo
            </span>
            <span>|</span>
            <Link to="/contact" className="hover:text-white transition-colors">Yardım & Destek</Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER NAVBAR */}
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

          {/* SEARCH BAR WITH LIVE AUTOCOMPLETE DROPDOWN */}
          <div className="relative flex-1 max-w-md mx-2 hidden md:block z-30">
            <form onSubmit={handleSearch}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Premium ürün, marka veya model ara..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#111827]/70 border border-[#1F2937] rounded-full text-xs text-[#F8FAFC] placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-[#111827] transition-all"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#CBD5E1]/60 pointer-events-none" />
              </div>
            </form>

            {/* LIVE AUTOCOMPLETE DROPDOWN */}
            <AnimatePresence>
              {isSearchFocused && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsSearchFocused(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 right-0 mt-2 rounded-2xl border border-[#1F2937] bg-[#111827] text-white shadow-2xl p-4 z-30 space-y-4"
                  >
                    {/* POPULAR SEARCHES */}
                    {!searchQuery.trim() && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-400" /> Popüler Aramalar
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {popularSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSearchQuery(term);
                                navigate(`/search?q=${encodeURIComponent(term)}`);
                                setIsSearchFocused(false);
                              }}
                              className="text-xs bg-white/5 hover:bg-[#2563EB] px-3 py-1 rounded-full text-[#CBD5E1] hover:text-white transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LIVE SEARCH RESULTS */}
                    {searchQuery.trim() && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1]">
                          Eşleşen Ürünler ({filteredSuggestions.length})
                        </span>
                        {filteredSuggestions.length > 0 ? (
                          <div className="space-y-1">
                            {filteredSuggestions.map((item) => (
                              <Link
                                key={item.id}
                                to={`/products/${item.id}`}
                                onClick={() => setIsSearchFocused(false)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                              >
                                <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#3B82F6] transition-colors">
                                    {item.name}
                                  </h4>
                                  <span className="text-[10px] text-[#CBD5E1]">{item.category}</span>
                                </div>
                                <span className="text-xs font-black text-[#3B82F6]">{item.price}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#CBD5E1] italic py-2">Eşleşen ürün bulunamadı.</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
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
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">Bildirimler</h4>
                        <Link
                          to="/notifications"
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-[11px] font-semibold text-[#3B82F6] hover:underline"
                        >
                          Tümünü Gör
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-xl bg-white/5 space-y-1 text-xs">
                            <span className="font-bold text-white block">{n.title}</span>
                            <p className="text-[#CBD5E1] text-[11px]">{n.text}</p>
                            <span className="text-[9px] text-[#CBD5E1]/60 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
              title="Favorilerim"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
              title="Sepetim"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Login Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 border border-[#2563EB] text-[#3B82F6] flex items-center justify-center font-bold text-xs">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#1F2937] bg-[#111827] text-[#F8FAFC] shadow-2xl p-2 z-20 space-y-1"
                      >
                        <div className="p-2 border-b border-[#1F2937]">
                          <span className="font-bold text-xs block text-white">{user?.firstName} {user?.lastName}</span>
                          <span className="text-[10px] text-[#CBD5E1] truncate block">{user?.email}</span>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#3B82F6]" /> Profilim
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#3B82F6]" /> Siparişlerim
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Çıkış Yap
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold">
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full text-xs font-semibold shadow-md">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#CBD5E1] hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* LOCATION SELECTION MODAL */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setIsLocationModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-3xl p-6 shadow-2xl z-50 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#3B82F6]" /> Teslimat Şehri Seçin
                </h3>
                <button onClick={() => setIsLocationModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {citiesList.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsLocationModalOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCity === city
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Sparkles className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
