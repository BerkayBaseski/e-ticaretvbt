import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../../api';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) return;
    
    setIsLoading(true);
    try {
      await authApi.register(formData);
      success('Kayıt Başarılı', 'Aramıza hoş geldiniz! Lütfen oluşturduğunuz hesapla giriş yapın.');
      navigate('/login');
    } catch (err: any) {
      error('Kayıt Başarısız', err.message || 'Bir sorun oluştu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#111827] border border-[#1F2937] p-8 rounded-3xl shadow-2xl relative z-10 space-y-6"
      >
        {/* BRAND HEADER */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#F8FAFC]">
              Nova<span className="text-[#3B82F6]">Store</span>
            </span>
          </Link>
          <h1 className="text-xl font-extrabold text-white tracking-tight pt-2">Yeni Hesap Oluşturun</h1>
          <p className="text-xs text-muted-foreground">Ayrıcalıklı alışveriş dünyasına hemen katılın</p>
        </div>

        {/* REGISTER FORM */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 ml-1">Adınız</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-[#1F2937] text-white rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40 transition-all placeholder:text-gray-500 text-xs font-medium"
                  placeholder="Ahmet"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 ml-1">Soyadınız</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-[#1F2937] text-white rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40 transition-all placeholder:text-gray-500 text-xs font-medium"
                  placeholder="Yılmaz"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 ml-1">E-Posta Adresi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[#1F2937] text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40 transition-all placeholder:text-gray-500 text-xs font-medium"
                placeholder="ornek@novastore.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 ml-1">Şifre Belirleyin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[#1F2937] text-white rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40 transition-all placeholder:text-gray-500 text-xs font-medium"
                placeholder="En az 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Ücretsiz ve hızlı teslimat avantajları</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Kupon ve kampanya bildirimleri</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl py-3.5 font-bold text-sm shadow-lg gap-2 mt-4"
          >
            {isLoading ? 'Hesap Oluşturuluyor...' : 'Ücretsiz Kayıt Ol'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* LOGIN FOOTER LINK */}
        <div className="text-center pt-2 border-t border-[#1F2937]">
          <p className="text-xs text-gray-400">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-bold text-[#3B82F6] hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
