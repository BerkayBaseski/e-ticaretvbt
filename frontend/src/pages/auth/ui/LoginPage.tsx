import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, ArrowRight } from 'lucide-react';
import { authApi } from '../../../shared/api';
import { useAuthStore } from '../../../entities/auth/model/authStore';
import { useToast } from '../../../shared/ui/Toast';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { setAuth } = useAuthStore();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      success('Giriş Başarılı', `Hoş geldiniz, ${response.user.firstName}!`);
      navigate(redirect, { replace: true });
    } catch (err: any) {
      toastError('Giriş Yapılamadı', err.message || 'E-posta veya şifre hatalı.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
          N
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">Hesabınıza Giriş Yapın</h1>
        <p className="text-xs text-[#CBD5E1]">
          Siparişlerinizi takip etmek ve sepetinize ulaşmak için oturum açın.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#1F2937] bg-[#111827] p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-Posta Adresi"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="ornek@eticaret.com"
          />

          <Input
            label="Şifre"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="••••••••"
          />

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full rounded-xl font-bold gap-2">
            <LogIn className="w-4 h-4" /> Giriş Yap
          </Button>
        </form>

        <div className="text-center text-xs text-[#CBD5E1] pt-2 border-t border-[#1F2937]">
          Henüz bir hesabınız yok mu?{' '}
          <Link to="/register" className="font-bold text-[#3B82F6] hover:underline inline-flex items-center gap-0.5">
            Hemen Kayıt Olun <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
