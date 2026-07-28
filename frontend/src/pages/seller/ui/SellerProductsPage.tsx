import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SellerLayout } from './SellerLayout';
import { Plus, Search, Edit3, Trash2, Eye } from 'lucide-react';
import { mockProducts } from '../../../shared/api/mocks/mockData';
import { formatPrice } from '../../../shared/lib/utils';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/ui/Toast';

export const SellerProductsPage: React.FC = () => {
  const { success } = useToast();
  const [productsList, setProductsList] = useState(mockProducts);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string, name: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    success('Ürün Silindi', `${name} yayından kaldırıldı.`);
  };

  const filteredProducts = productsList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ürün Kataloğu Yönetimi</h1>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              Mağazanızdaki toplam <span className="font-semibold text-white">{filteredProducts.length} ürünü</span> yönetin.
            </p>
          </div>

          <Link to="/seller/products/new">
            <Button size="sm" className="gap-2 font-bold text-xs rounded-xl shadow-lg">
              <Plus className="w-4 h-4" /> Yeni Ürün Ekle
            </Button>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <Input
              placeholder="Ürün adı veya kategori ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[#CBD5E1]" />}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0B1220] border-b border-[#1F2937] text-[11px] font-bold uppercase tracking-wider text-white">
                <tr>
                  <th className="p-4">Ürün Bilgisi</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Fiyat</th>
                  <th className="p-4">Stok Durumu</th>
                  <th className="p-4 text-center">Değerlendirme</th>
                  <th className="p-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-black" />
                        <div className="space-y-0.5">
                          <p className="font-bold text-white max-w-xs truncate">{product.name}</p>
                          <p className="text-[10px] text-[#CBD5E1]/60 font-mono">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#3B82F6]/15 text-[#3B82F6] font-semibold text-[11px]">
                        {product.categoryName}
                      </span>
                    </td>
                    <td className="p-4 font-black text-white text-sm">
                      {formatPrice(product.price, product.currency)}
                    </td>
                    <td className="p-4">
                      {product.stock > 10 ? (
                        <Badge variant="success">Stokta ({product.stock})</Badge>
                      ) : product.stock > 0 ? (
                        <Badge variant="warning">Kritik Stok ({product.stock})</Badge>
                      ) : (
                        <Badge variant="destructive">Tükendi</Badge>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-amber-400">
                      ★ {product.rating} ({product.reviewCount})
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/products/${product.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#CBD5E1] hover:text-white" title="Mağazada Gör">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to="/seller/products/new">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#3B82F6] hover:bg-[#3B82F6]/10" title="Düzenle">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="h-8 w-8 text-rose-400 hover:bg-rose-500/10"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};
