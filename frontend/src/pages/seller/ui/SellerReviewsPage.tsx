import React, { useState } from 'react';
import { SellerLayout } from './SellerLayout';
import { Star, MessageSquare, CornerDownRight } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useToast } from '../../../shared/ui/Toast';

export const SellerReviewsPage: React.FC = () => {
  const { success } = useToast();
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [repliedIds, setRepliedIds] = useState<number[]>([]);

  const reviews = [
    {
      id: 1,
      productName: 'AuraSound Pro Gürültü Önleyici Kulaklık',
      customerName: 'Merve K.',
      rating: 5,
      date: '24 Temmuz 2026',
      comment: 'Ürün harika, ses kalitesi yüksek ve paketleme çok sağlam yapılmıştı. 1 günde elime ulaştı.',
    },
    {
      id: 2,
      productName: 'Nordic Minimalist Akıllı Saat Gen 4',
      customerName: 'Caner Ş.',
      rating: 5,
      date: '22 Temmuz 2026',
      comment: 'Şarjı gerçekten 12-14 gün gidiyor. Şıklığı bilekte belli oluyor, teşekkürler!',
    },
    {
      id: 3,
      productName: '%100 Organik Pamuk Oversize Erkek Tişört',
      customerName: 'Ahmet Y.',
      rating: 4,
      date: '18 Temmuz 2026',
      comment: 'Kumaş kalitesi çok güzel ama kalıbı bayağı rahat. Bir beden küçük almanızı tavsiye ederim.',
    },
  ];

  const handleSendReply = (reviewId: number) => {
    if (!replyText[reviewId]?.trim()) return;
    setRepliedIds([...repliedIds, reviewId]);
    success('Yanıt Gönderildi', 'Müşteri yorumuna verdiğiniz yanıt yayınlandı.');
  };

  return (
    <SellerLayout>
      <div className="space-y-8 pb-12">
        <div className="border-b border-[#1F2937] pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Müşteri Değerlendirmeleri</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">Mağazanızdaki ürünlere yapılan değerlendirmeleri görün ve yanıtlayın.</p>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => {
            const hasReplied = repliedIds.includes(rev.id);
            return (
              <div key={rev.id} className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-3 text-xs">
                  <div>
                    <span className="font-bold text-[#3B82F6]">{rev.productName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#CBD5E1]">
                    <span className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" /> {rev.rating} Puan
                    </span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.customerName}</span>
                    <span className="text-[10px] text-[#22C55E]">Doğrulanmış Satın Alım</span>
                  </div>
                  <p className="text-[#CBD5E1] leading-relaxed italic">"{rev.comment}"</p>
                </div>

                {/* Reply Form */}
                <div className="pt-2 border-t border-[#1F2937]/50 space-y-2">
                  {hasReplied ? (
                    <div className="p-3 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-xs text-[#3B82F6] flex items-center gap-2">
                      <CornerDownRight className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="font-bold block">Mağaza Yanıtınız:</span>
                        <span className="text-white">{replyText[rev.id]}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Müşteriye resmi mağaza yanıtı yazın..."
                        value={replyText[rev.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                        className="flex-1 h-9 px-3 bg-[#050816] border border-[#1F2937] rounded-xl text-xs text-white placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      />
                      <Button size="sm" onClick={() => handleSendReply(rev.id)} className="rounded-xl text-xs gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Yanıtla
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SellerLayout>
  );
};
