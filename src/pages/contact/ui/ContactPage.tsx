import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

export const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-white">İletişim & Destek</h1>
        <p className="text-xs text-[#CBD5E1] max-w-md mx-auto">
          Sorularınız, önerileriniz ve iş birlikleri için bize 7/24 ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-5 rounded-[20px] border border-[#1F2937] bg-[#111827] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">E-Posta</h4>
              <p className="text-xs text-[#CBD5E1]">destek@novastore.example.com</p>
            </div>
          </div>

          <div className="p-5 rounded-[20px] border border-[#1F2937] bg-[#111827] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Müşteri Hizmetleri</h4>
              <p className="text-xs text-[#CBD5E1]">+90 850 123 45 67</p>
            </div>
          </div>

          <div className="p-5 rounded-[20px] border border-[#1F2937] bg-[#111827] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Genel Merkez</h4>
              <p className="text-xs text-[#CBD5E1]">Kadıköy, İstanbul</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 rounded-[24px] border border-[#1F2937] bg-[#111827] p-8 shadow-lg">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto" />
              <h3 className="text-xl font-bold text-white">Mesajınız Alındı</h3>
              <p className="text-xs text-[#CBD5E1]">En kısa sürede e-posta adresiniz üzerinden geri dönüş sağlanacaktır.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Adınız" placeholder="Ahmet" required />
                <Input label="Soyadınız" placeholder="Yılmaz" required />
              </div>
              <Input label="E-Posta" type="email" placeholder="ahmet@example.com" required />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white">Mesajınız</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detaylı açıklamanızı buraya yazınız..."
                  className="w-full p-3 bg-[#050816] border border-[#1F2937] rounded-xl text-xs text-white placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl gap-2 font-bold">
                <Send className="w-4 h-4" /> Mesaj Gönder
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
