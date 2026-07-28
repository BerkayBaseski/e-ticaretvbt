import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import { authApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Adınız en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyadınız en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    confirmPassword: z.string().min(6, 'Şifre tekrarı gereklidir'),
    acceptTerms: z.boolean().refine((val) => val === true, 'Kullanım şartlarını kabul etmelisiniz'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Girilen şifreler eşleşmiyor',
    path: ['confirmPassword'],
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
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      setAuth(response.user, response.accessToken, response.refreshToken);
      success('Kayıt Başarılı', `Aramıza hoş geldiniz, ${response.user.firstName}!`);
      navigate('/', { replace: true });
    } catch (err: any) {
      toastError('Kayıt Oluşturulamadı', err.message || 'Kayıt olurken bir sunucu hatası yaşandı.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl mx-auto shadow-sm">
          N
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Yeni Hesap Oluşturun</h1>
        <p className="text-xs text-muted-foreground">
          Özel fırsatlardan faydalanmak için hemen üye olun.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ad" {...register('firstName')} error={errors.firstName?.message} placeholder="Ahmet" />
            <Input label="Soyad" {...register('lastName')} error={errors.lastName?.message} placeholder="Yılmaz" />
          </div>

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

          <Input
            label="Şifre Tekrarı"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="••••••••"
          />

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="acceptTerms"
              {...register('acceptTerms')}
              className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="acceptTerms" className="text-xs text-muted-foreground leading-snug cursor-pointer">
              Kullanım şartlarını ve Gizlilik Politikası'nı okudum, kabul ediyorum.
            </label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-destructive font-medium">{errors.acceptTerms.message}</p>}

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full rounded-xl font-bold gap-2">
            <UserPlus className="w-4 h-4" /> Kayıt Ol
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          Zaten bir hesabınız var mı?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline inline-flex items-center gap-0.5">
            Giriş Yapın <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
