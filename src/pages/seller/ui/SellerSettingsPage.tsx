import React, { useState } from 'react';
import { SellerLayout } from './SellerLayout';
import { Store, CreditCard, ShieldCheck, Check } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/ui/Toast';

export const SellerSettingsPage: React.FC = () => {
  const { success } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const [storeData, setStoreData] = useState({
    storeName: 'Nova Luxury Store',
    contactEmail: 'seller@novastore.example.com',
    phone: '+90 850 444 00 99',
    description: 'Türkiye\'nin öncü premium elektronik ve aksesuar mağazası.',
    iban: 'TR42 0006 2000 0000 1234 5678 90',
    taxNumber: '9842104921',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    success('Mağaza Ayarları Güncellendi', 'Tüm mağaza ve hakediş IBAN bilgileriniz kaydedildi.');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="border-b border-[#1F2937] pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Mağaza Ayarları & Hakediş Bilgileri</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">Mağaza profilinizi ve ödeme aktarım hesaplarınızı güncelleyin.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#3B82F6]" /> Mağaza Profil Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mağaza Adı"
                required
                value={storeData.storeName}
                onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
              />
              <Input
                label="İletişim E-Postası"
                required
                type="email"
                value={storeData.contactEmail}
                onChange={(e) => setStoreData({ ...storeData, contactEmail: e.target.value })}
              />
              <Input
                label="Telefon"
                required
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
              />
              <Input
                label="Vergi Kimlik Numarası"
                required
                value={storeData.taxNumber}
                onChange={(e) => setStoreData({ ...storeData, taxNumber: e.target.value })}
              />
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-medium text-white">Mağaza Tanıtım Yazısı</label>
                <textarea
                  rows={3}
                  value={storeData.description}
                  onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                  className="w-full p-3 bg-[#050816] border border-[#1F2937] rounded-xl text-xs text-white placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#3B82F6]" /> Hakediş Payout IBAN Hesabı
            </h3>

            <div className="space-y-4">
              <Input
                label="Banka IBAN Numarası"
                required
                value={storeData.iban}
                onChange={(e) => setStoreData({ ...storeData, iban: e.target.value })}
              />
              <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs text-[#22C55E] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Hakediş ödemeleriniz her Pazartesi otomatik olarak belirtilen IBAN hesabına aktarılır.</span>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" variant={isSaved ? 'secondary' : 'primary'} className="w-full rounded-xl font-bold gap-2 shadow-xl">
            {isSaved ? <><Check className="w-5 h-5 text-[#22C55E]" /> Ayarlar Kaydedildi</> : 'Değişiklikleri Kaydet'}
          </Button>
        </form>
      </div>
    </SellerLayout>
  );
};
