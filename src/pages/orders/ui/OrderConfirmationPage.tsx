import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center mx-auto shadow-xl">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Siparişiniz Başarıyla Alındı!</h1>
        <p className="text-xs text-[#CBD5E1]">
          Sipariş kaydınız sistemimize ulaştı. Sipariş numaranız:{' '}
          <span className="font-bold text-white">{orderId}</span>
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] text-left space-y-3 text-xs text-[#CBD5E1]">
        <div className="flex justify-between border-b border-[#1F2937] pb-2">
          <span>Sipariş Durumu</span>
          <span className="font-bold text-[#22C55E]">Hazırlanıyor</span>
        </div>
        <div className="flex justify-between border-b border-[#1F2937] pb-2">
          <span>Tahmini Teslimat</span>
          <span className="font-semibold text-white">1 - 3 İş Günü</span>
        </div>
        <p className="text-[11px] leading-relaxed pt-1">
          Siparişinizin durumunu "Siparişlerim" sayfasından veya e-posta adresinize gönderilen kargo takip linkinden canlı izleyebilirsiniz.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Link to="/orders">
          <Button variant="outline" className="w-full sm:w-auto gap-2 text-xs">
            <Package className="w-4 h-4" /> Siparişlerime Git
          </Button>
        </Link>
        <Link to="/">
          <Button className="w-full sm:w-auto gap-2 text-xs">
            Alışverişe Devam Et <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
