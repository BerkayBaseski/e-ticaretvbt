import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { productsApi } from '../../../shared/api';
import type { Product } from '../../../shared/types';
import { ProductCard } from '../../../entities/product/ui/ProductCard';
import { QuickViewModal } from '../../../shared/ui/QuickViewModal';
import { ProductGridSkeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Input } from '../../../shared/ui/Input';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['search-products', selectedCategory, sort],
    queryFn: () =>
      productsApi.getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sort !== 'default' ? sort : undefined,
        size: 50,
      }),
  });

  const products = productsData?.content || [];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ürün Kataloğu & Arama</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Toplam <span className="font-semibold text-white">{filteredProducts.length} ürün</span> bulundu.
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#3B82F6]" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="h-10 px-3 bg-[#111827] border border-[#1F2937] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="default">Sıralama: Varsayılan</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="rating">Puan: En Yüksek</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-[#1F2937] pb-3">
              <SlidersHorizontal className="w-4 h-4 text-[#3B82F6]" /> Filtreler
            </h3>

            {/* Live Search Input */}
            <div className="space-y-1">
              <label className="text-xs text-[#CBD5E1] font-semibold">Anahtar Kelime</label>
              <Input
                placeholder="Model, isim veya özellik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#CBD5E1]" />}
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2 pt-2">
              <label className="text-xs text-[#CBD5E1] font-semibold block">Kategoriler</label>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#3B82F6] font-bold text-white'
                      : 'text-[#CBD5E1] hover:bg-white/5'
                  }`}
                >
                  <span>Tüm Kategoriler</span>
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-[#3B82F6] font-bold text-white'
                        : 'text-[#CBD5E1] hover:bg-white/5'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Aramanızla Eşleşen Ürün Bulunamadı"
              description="Lütfen arama terimlerinizi değiştirin veya filtreleri temizleyerek tekrar deneyin."
              actionText="Filtreleri Temizle"
              onAction={() => {
                setSearch('');
                setSelectedCategory('all');
                setSort('default');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </main>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
