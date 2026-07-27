import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal, PackageSearch } from 'lucide-react';
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
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
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
    queryKey: ['search-products', page, size, category, q, minPrice, maxPrice, sort],
    queryFn: () =>
      productsApi.getProducts({
        page,
        size,
        category: category || undefined,
        q: q || undefined,
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

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ürün Arama & Filtreleme</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {q ? `"${q}" araması için ` : 'Tüm ürün grupları içinde '}
            <span className="font-semibold text-foreground">{productsData?.totalElements || 0} ürün</span> bulundu
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
            Filtreler
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
              className="h-10 px-3 bg-background border border-input rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="rounded-2xl border border-border bg-card p-5 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Filtreler
              </h3>
              {(q || category || minPrice || maxPrice || sort !== 'featured') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Sıfırla
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
                  placeholder="Ürün adı, tag..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Kategoriler</label>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !category ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-accent text-muted-foreground'
                  }`}
                >
                  Tüm Kategoriler
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      category === cat.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-accent text-muted-foreground'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground">Fiyat Aralığı (₺)</label>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" className="w-full text-xs">
                  Fiyat Filtresini Uygula
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT LIST & PAGINATION */}
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

          {/* HAPPY PATH PRODUCT GRID */}
          {!isLoading && !isError && productsData && productsData.content.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* PAGINATION */}
              {productsData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateParam('page', (page - 1).toString())}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Önceki
                  </Button>

                  <div className="flex items-center gap-1 px-3 text-xs font-semibold text-muted-foreground">
                    Sayfa <span className="text-foreground mx-1">{page}</span> / {productsData.totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= productsData.totalPages}
                    onClick={() => updateParam('page', (page + 1).toString())}
                    className="gap-1"
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
