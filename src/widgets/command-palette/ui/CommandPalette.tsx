import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, User, ShoppingBag, Store, Compass, Sparkles } from 'lucide-react';
import { mockProducts, mockCategories } from '../../../shared/api/mocks/mockData';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleOpen = () => setOpen(true);
    window.addEventListener('command-palette:open', handleOpen);
    document.addEventListener('keydown', down);

    return () => {
      window.removeEventListener('command-palette:open', handleOpen);
      document.removeEventListener('keydown', down);
    };
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl rounded-[24px] bg-[#0F172A] border border-[#1F2937] text-[#F8FAFC] shadow-2xl overflow-hidden z-10"
          >
            <Command className="w-full bg-transparent">
              <div className="flex items-center border-b border-[#1F2937] px-4">
                <Search className="w-4 h-4 text-[#3B82F6] shrink-0 mr-3" />
                <Command.Input
                  autoFocus
                  placeholder="Ürün, kategori, sayfa veya satıcı paneli ara..."
                  className="w-full h-14 bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none"
                />
                <span className="text-[10px] font-mono text-[#94A3B8] px-2 py-1 rounded bg-[#1E293B]">ESC</span>
              </div>

              <Command.List className="max-h-96 overflow-y-auto p-3 space-y-3">
                <Command.Empty className="py-6 text-center text-xs text-[#94A3B8]">
                  Aramanızla eşleşen hiçbir öge bulunamadı.
                </Command.Empty>

                <Command.Group heading={<span className="text-[10px] font-extrabold tracking-widest uppercase text-[#3B82F6] px-2">Hızlı Menü</span>}>
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#3B82F6]" /> Ana Sayfa
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/search'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#3B82F6]" /> Tüm Ürün Kataloğu
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/cart'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#3B82F6]" /> Sepetim
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/compare'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#3B82F6]" /> Ürün Karşılaştırma
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/profile'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#3B82F6]" /> Profilim & Ayarlar
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/seller'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-[#22C55E]" /> Satıcı Paneli (Seller Center)
                  </Command.Item>
                </Command.Group>

                <Command.Group heading={<span className="text-[10px] font-extrabold tracking-widest uppercase text-[#3B82F6] px-2">Kategoriler</span>}>
                  {mockCategories.map((cat) => (
                    <Command.Item
                      key={cat.id}
                      onSelect={() => runCommand(() => navigate(`/search?category=${cat.id}`))}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">{cat.itemCount} Ürün</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={<span className="text-[10px] font-extrabold tracking-widest uppercase text-[#3B82F6] px-2">Popüler Ürünler</span>}>
                  {mockProducts.slice(0, 5).map((prod) => (
                    <Command.Item
                      key={prod.id}
                      onSelect={() => runCommand(() => navigate(`/products/${prod.id}`))}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-[#60A5FA]" />
                      <span className="truncate flex-1">{prod.name}</span>
                      <span className="font-bold text-white">{prod.price} ₺</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
