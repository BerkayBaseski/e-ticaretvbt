import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { Input } from '../../../shared/ui/Input';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'Siparişlerim ne kadar sürede kargoya verilir?',
      a: 'Saat 15:00\'e kadar verilen tüm siparişler aynı gün kargoya teslim edilmektedir. Teslimat süresi adrese bağlı olarak 1-3 iş günüdür.',
    },
    {
      q: 'İade ve değişim sürecini nasıl başlatabilirim?',
      a: 'Siparişinizi teslim aldıktan sonra 30 gün içerisinde hesabınızdaki Siparişlerim sayfasından kolay iade talebi oluşturabilirsiniz.',
    },
    {
      q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      a: 'Tüm Visa, MasterCard ve Troy altyapılı kredi kartları, banka kartları ve havale/EFT seçeneği ile ödeme yapabilirsiniz.',
    },
    {
      q: 'Kargo ücreti ne kadar?',
      a: '1000 TL ve üzeri tüm alışverişlerinizde kargo tamamen ücretsizdir. 1000 TL altı siparişlerde standart kargo ücreti 49 TL\'dir.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-white">Sıkça Sorulan Sorular</h1>
        <p className="text-xs text-[#CBD5E1] max-w-md mx-auto">
          Aklınıza takılan tüm soruların yanıtlarını buradan bulabilirsiniz.
        </p>

        <div className="max-w-md mx-auto pt-2">
          <Input
            placeholder="Soru ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#CBD5E1]" />}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="rounded-[20px] border border-[#1F2937] bg-[#111827] overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[#3B82F6] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <div className="p-5 pt-0 text-xs text-[#CBD5E1] leading-relaxed border-t border-[#1F2937]/50">{faq.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
