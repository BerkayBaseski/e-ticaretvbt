import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SellerLayout } from './SellerLayout';
import { Upload, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { mockCategories } from '../../../shared/api/mocks/mockData';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/ui/Toast';

export const SellerAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat-1',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
  });

  const [images] = useState<string[]>([
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ]);

  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'Garanti Süresi', value: '2 Yıl' },
    { key: 'Kargo', value: '24 Saatte Kargoda' },
  ]);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      success('Ürün Başarıyla Eklendi', `${formData.name || 'Yeni ürün'} mağazanızda yayına alındı.`);
      navigate('/seller/products');
    }, 800);
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
          <div>
            <Link to="/seller/products" className="text-xs text-[#CBD5E1] hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Ürün Kataloğuna Dön
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">Yeni Ürün Ekle</h1>
            <p className="text-xs text-[#CBD5E1] mt-0.5">Mağazanıza yeni bir ürün eklemek için formu doldurun.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">1. Temel Ürün Bilgileri</h3>
            <div className="space-y-4">
              <Input
                label="Ürün Başlığı / Adı"
                required
                placeholder="Örn: AuraSound Pro Gürültü Önleyici Kulaklık"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-white">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-11 px-3 bg-[#050816] border border-[#1F2937] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Stok Adedi"
                  type="number"
                  required
                  placeholder="25"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Satış Fiyatı (TL)"
                  type="number"
                  required
                  placeholder="3499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <Input
                  label="İndirim Öncesi Fiyat (İsteğe Bağlı TL)"
                  type="number"
                  placeholder="4299"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white">Ürün Açıklaması</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ürününüzün tüm öne çıkan teknolojik ve malzeme özelliklerini yazınız..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#050816] border border-[#1F2937] rounded-xl text-xs text-white placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          {/* Product Images Upload UI */}
          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">2. Görseller & Fotoğraflar</h3>

            <div className="border-2 border-dashed border-[#1F2937] hover:border-[#3B82F6]/50 rounded-2xl p-6 text-center space-y-2 bg-[#050816]/40 cursor-pointer">
              <Upload className="w-8 h-8 text-[#3B82F6] mx-auto" />
              <p className="text-xs font-bold text-white">Görselleri Sürükleyin veya Dosya Seçin</p>
              <p className="text-[10px] text-[#CBD5E1]">PNG, JPG, WEBP — Maksimum 10MB</p>
            </div>

            <div className="flex gap-3 overflow-x-auto pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square w-24 rounded-xl overflow-hidden border border-[#1F2937] group shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Kapuk {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs Matrix */}
          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h3 className="font-bold text-sm text-white">3. Teknik Özellikler Tablosu</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSpec} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Satır Ekle
              </Button>
            </div>

            <div className="space-y-3">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input
                    placeholder="Özellik Adı (Örn: Ekran)"
                    value={spec.key}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].key = e.target.value;
                      setSpecs(updated);
                    }}
                  />
                  <Input
                    placeholder="Değer (Örn: 1.43 inç AMOLED)"
                    value={spec.value}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].value = e.target.value;
                      setSpecs(updated);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSpec(idx)}
                    className="h-10 w-10 text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full rounded-xl font-bold gap-2 text-base shadow-xl">
            <CheckCircle2 className="w-5 h-5" /> Ürünü Mağazada Yayınla
          </Button>
        </form>
      </div>
    </SellerLayout>
  );
};
