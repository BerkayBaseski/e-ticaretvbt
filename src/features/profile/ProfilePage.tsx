import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../api';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli e-posta giriniz'),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await authApi.updateMe({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: 'Türkiye',
        },
      });

      updateUser(updated);
      success('Profil Güncellendi', 'Kullanıcı bilgileriniz ve adresiniz kaydedildi.');
    } catch (err: any) {
      toastError('Güncelleme Hatası', err.message || 'Bilgiler kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Kullanıcı Profilim</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kişisel bilgilerinizi ve kayıtlı varsayılan teslimat adresinizi buradan yönetebilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* PERSONAL DETAILS */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <UserIcon className="w-5 h-5 text-primary" /> Kişisel Bilgiler
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ad" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Soyad" {...register('lastName')} error={errors.lastName?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="E-Posta Adresi" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Telefon Numarası" {...register('phone')} error={errors.phone?.message} placeholder="+90 5XX..." />
          </div>
        </div>

        {/* DEFAULT SHIPPING ADDRESS */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="w-5 h-5 text-primary" /> Kayıtlı Teslimat Adresi
          </h3>

          <Input label="Açık Adres (Sokak / Bina)" {...register('street')} placeholder="Atatürk Cad. No: 42 D: 7" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Şehir (İl)" {...register('city')} placeholder="İstanbul" />
            <Input label="İlçe / Semt" {...register('state')} placeholder="Kadıköy" />
            <Input label="Posta Kodu" {...register('zipCode')} placeholder="34710" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Bilgileriniz güvenle saklanmaktadır
          </div>

          <Button type="submit" size="lg" isLoading={isSubmitting} disabled={!isDirty} className="gap-2 shadow-md">
            <Save className="w-4 h-4" /> Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
};
