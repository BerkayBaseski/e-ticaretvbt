import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import { authApi } from '../../../shared/api';
import { useAuthStore } from '../../../entities/auth/model/authStore';
import { useToast } from '../../../shared/ui/Toast';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authApi.register(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      success('Kayıt Başarılı', 'Hesabınız oluşturuldu.');
      navigate('/');
    } catch (err: any) {
      toastError('Kayıt Yapılamadı', err.message || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
          N
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">Yeni Hesap Oluşturun</h1>
        <p className="text-xs text-[#CBD5E1]">NovaStore ayrıcalıklarından yararlanmak için hemen üye olun.</p>
      </div>

      <div className="rounded-[24px] border border-[#1F2937] bg-[#111827] p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ad" {...register('firstName')} error={errors.firstName?.message} placeholder="Ahmet" />
            <Input label="Soyad" {...register('lastName')} error={errors.lastName?.message} placeholder="Yılmaz" />
          </div>

          <Input label="E-Posta Adresi" type="email" {...register('email')} error={errors.email?.message} placeholder="ahmet@example.com" />
          <Input label="Şifre" type="password" {...register('password')} error={errors.password?.message} placeholder="••••••••" />

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full rounded-xl font-bold gap-2">
            <UserPlus className="w-4 h-4" /> Kayıt Ol
          </Button>
        </form>

        <div className="text-center text-xs text-[#CBD5E1] pt-2 border-t border-[#1F2937]">
          Zaten bir hesabınız var mı?{' '}
          <Link to="/login" className="font-bold text-[#3B82F6] hover:underline inline-flex items-center gap-0.5">
            Giriş Yapın <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
