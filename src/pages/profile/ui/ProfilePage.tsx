import React, { useState } from 'react';
import { User as UserIcon, MapPin, ShieldCheck, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../../entities/auth/model/authStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/ui/Toast';

export const ProfilePage: React.FC = () => {
  const { user, setAuth, logout } = useAuthStore();
  const { success } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: {
        ...user.address,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: user.address?.zipCode || '34710',
        country: 'Türkiye',
      },
    };

    setAuth(updatedUser, localStorage.getItem('access_token') || '', localStorage.getItem('refresh_token') || '');
    setIsSaved(true);
    success('Profil Güncellendi', 'Profil ve adres bilgileriniz başarıyla kaydedildi.');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-[#1F2937] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Profilim & Hesap Ayarları</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">Kişisel bilgilerinizi ve teslimat adreslerinizi düzenleyin.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={logout} className="gap-1.5 text-xs">
          <LogOut className="w-4 h-4" /> Oturumu Kapat
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-[#1F2937] pb-3">
              <UserIcon className="w-4 h-4 text-[#3B82F6]" /> Kişisel Bilgiler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ad"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                label="Soyad"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <Input label="E-Posta Adresi" disabled value={formData.email} />
              <Input
                label="Telefon Numarası"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-[#1F2937] pb-3">
              <MapPin className="w-4 h-4 text-[#3B82F6]" /> Kayıtlı Teslimat Adresi
            </h3>
            <div className="space-y-4">
              <Input
                label="Cadde / Sokak / Kapı No"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="İl"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  label="İlçe"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-extrabold text-xl flex items-center justify-center mx-auto border border-[#3B82F6]/40">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{user?.firstName} {user?.lastName}</h3>
              <p className="text-xs text-[#CBD5E1]">{user?.email}</p>
            </div>
            <div className="pt-2">
              <Button type="submit" variant={isSaved ? 'secondary' : 'primary'} className="w-full rounded-xl gap-2 font-bold text-xs">
                {isSaved ? <><Check className="w-4 h-4 text-[#22C55E]" /> Kaydedildi</> : 'Değişiklikleri Kaydet'}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 text-xs text-[#CBD5E1] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
            <span>Hesabınız 256-bit şifreleme altyapısı ile güvence altındadır.</span>
          </div>
        </div>
      </form>
    </div>
  );
};
