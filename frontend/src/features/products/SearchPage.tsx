import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  PackageSearch,
  Star,
  Tag,
  Check
} from 'lucide-react';
import { productsApi } from '../../api';
import { ProductCard } from './components/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const sort = (searchParams.get('sort') as any) || 'featured';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = 12;

  // Local filter states for input fields
  const [localSearch, setLocalSearch] = useState(q);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(q);
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [q, minPrice, maxPrice]);

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  // Fetch Filtered Products
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['search-products', page, size, category, q, brandParam, minPrice, maxPrice, sort, minRating],
    queryFn: () =>
      productsApi.getProducts({
        page,
        size,
        category: category || undefined,
        q: q || undefined,
        brand: brandParam || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sort,
      }),
  });

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localMin) newParams.set('minPrice', localMin);
    else newParams.delete('minPrice');
    if (localMax) newParams.set('maxPrice', localMax);
    else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setLocalMin('');
    setLocalMax('');
  };

  const mockBrands = [
    { name: 'Apple', count: 6 },
    { name: 'Sony', count: 5 },
    { name: 'Bose', count: 4 },
    { name: 'Logitech', count: 4 },
    { name: 'Bang & Olufsen', count: 3 },
  ];

  const totalPages = productsData?.totalPages || 1;
  const totalElements = productsData?.totalElements || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ürün Arama & Filtreleme</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {q ? `"${q}" araması için ` : 'Tüm kategoriler içinde '}
            <span className="font-bold text-primary">{totalElements} adet ürün</span> bulundu
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            className="md:hidden gap-2"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtreler ({category || brandParam || minPrice ? 'Aktif' : '0'})
          </Button>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
              Sıralama:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="h-10 px-3 bg-background border border-input rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="featured">Öne Çıkanlar</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="rating">En Yüksek Puanlılar</option>
              <option value="newest">En Yeniler</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS - Desktop & Mobile */}
        <aside className={`md:block space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="rounded-2xl border border-border bg-[#111827] p-5 space-y-6 shadow-md">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Filtreler
              </h3>
              {(q || category || brandParam || minPrice || maxPrice || minRating || sort !== 'featured') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Temizle
                </button>
              )}
            </div>

            {/* Keyword Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Kelime İle Ara</label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateParam('q', localSearch);
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ürün adı, marka..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Categories List with Item Counts */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-primary" /> Kategoriler
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    !category ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-accent text-muted-foreground'
                  }`}
                >
                  <span>Tüm Kategoriler</span>
                  <span className="text-[10px] opacity-80">({totalElements})</span>
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      category === cat.id ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-accent text-muted-foreground'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-semibold opacity-80">
                      ({cat.itemCount || Math.floor(Math.random() * 5) + 3})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter with Item Counts */}
            <div className="space-y-2 pt-3 border-t border-border">
              <label className="text-xs font-semibold text-foreground">Markalar</label>
              <div className="space-y-1">
                {mockBrands.map((b) => {
                  const isSelected = brandParam === b.name;
                  return (
                    <button
                      key={b.name}
                      onClick={() => updateParam('brand', isSelected ? '' : b.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected ? 'bg-primary/20 text-primary font-bold border border-primary/40' : 'hover:bg-accent text-muted-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                        {b.name}
                      </span>
                      <span className="text-[10px] font-semibold opacity-70">({b.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-3 border-t border-border">
              <label className="text-xs font-semibold text-foreground">Değerlendirme Puanı</label>
              <div className="space-y-1">
                {[4, 3].map((r) => {
                  const isSelected = minRating === r.toString();
                  return (
                    <button
                      key={r}
                      onClick={() => updateParam('minRating', isSelected ? '' : r.toString())}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected ? 'bg-amber-400/20 text-amber-400 font-bold border border-amber-400/30' : 'hover:bg-accent text-muted-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {r}.0 ve Üzeri
                      </span>
                      <span className="text-[10px] opacity-70">({r === 4 ? 14 : 22})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-3 border-t border-border">
              <label className="text-xs font-semibold text-foreground">Fiyat Aralığı (₺)</label>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min ₺"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max ₺"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" className="w-full text-xs font-bold">
                  Fiyat Filtresini Uygula
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT GRID & NUMBERED PAGINATION */}
        <main className="md:col-span-3 space-y-8">
          {/* LOADING STATE */}
          {isLoading && <ProductGridSkeleton count={9} />}

          {/* ERROR STATE */}
          {isError && (
            <ErrorState
              title="Arama Sonuçları Yüklenemedi"
              message={(error as Error)?.message || 'Arama sırasında sunucu hatası oluştu.'}
              onRetry={() => refetch()}
            />
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && productsData?.content.length === 0 && (
            <EmptyState
              icon={<PackageSearch className="w-8 h-8" />}
              title="Aramanızla Eşleşen Ürün Bulunamadı"
              description="Arama kriterlerinizi değiştirerek veya filtreleri temizleyerek tekrar deneyebilirsiniz."
              actionText="Filtreleri Temizle"
              onAction={handleClearFilters}
            />
          )}

          {/* PRODUCT GRID */}
          {!isLoading && !isError && productsData && productsData.content.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* ENHANCED NUMBERED PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-border">
                  {/* Prev Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateParam('page', (page - 1).toString())}
                    className="gap-1 rounded-xl text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Önceki
                  </Button>

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => updateParam('page', pageNum.toString())}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          page === pageNum
                            ? 'bg-primary text-primary-foreground shadow-md scale-105'
                            : 'bg-[#111827] text-muted-foreground border border-border hover:text-foreground hover:border-primary/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => updateParam('page', (page + 1).toString())}
                    className="gap-1 rounded-xl text-xs font-bold"
                  >
                    Sonraki <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
