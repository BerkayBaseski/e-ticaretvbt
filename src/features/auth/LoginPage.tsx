import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, ArrowRight } from 'lucide-react';
import { authApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@eticaret.com',
      password: 'password123',
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

  const handleFillDemo = () => {
    setValue('email', 'demo@eticaret.com');
    setValue('password', 'password123');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl mx-auto shadow-sm">
          N
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Hesabınıza Giriş Yapın</h1>
        <p className="text-xs text-muted-foreground">
          Siparişlerinizi takip etmek ve sepetinize ulaşmak için oturum açın.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        {/* Quick Demo Fill Button */}
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-2">
          <div className="text-xs">
            <p className="font-bold text-primary">Hızlı Demo Girişi</p>
            <p className="text-muted-foreground">Test etmek için bilgileri doldurun.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleFillDemo} className="shrink-0 text-xs">
            Doldur
          </Button>
        </div>

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

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          Henüz bir hesabınız yok mu?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline inline-flex items-center gap-0.5">
            Hemen Kayıt Olun <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
