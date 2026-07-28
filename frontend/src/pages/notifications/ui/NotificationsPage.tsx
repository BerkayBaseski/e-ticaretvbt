import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Tag, Truck, ShieldAlert, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/ui/Toast';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'discount' | 'system' | 'security';
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Yaz Fırsatları & Süper İndirimler Başladı',
    description: 'Tüm elektronik ve aksesuar kategorilerinde sepette sepette %20 özel indirim tanımlandı.',
    time: '10 dakika önce',
    type: 'discount',
    isRead: false,
    link: '/search?category=cat-1',
  },
  {
    id: 'n-2',
    title: 'Siparişiniz Kargoya Verildi',
    description: '#ORD-94821 numaralı siparişiniz Kolay Gelsin Kargo kuryesine teslim edilmiştir.',
    time: '2 saat önce',
    type: 'order',
    isRead: false,
    link: '/orders',
  },
  {
    id: 'n-3',
    title: 'Hesap Güvenliği Uyarısı',
    description: 'Yeni bir cihazdan hesabınıza giriş yapıldı (Chrome / Windows 11). Siz değilseniz şifrenizi güncelleyin.',
    time: 'Dün, 18:45',
    type: 'security',
    isRead: true,
    link: '/profile',
  },
  {
    id: 'n-4',
    title: 'Sistem Bakımı Tamamlandı',
    description: 'Ödeme ve sepet altyapısındaki hızlandırma çalışmaları başarıyla tamamlanmıştır.',
    time: '2 gün önce',
    type: 'system',
    isRead: true,
  },
  {
    id: 'n-5',
    title: 'Favorinizdeki Ürünün Fiyatı Düştü!',
    description: 'Favori listenizdeki "Sony WH-1000XM5 Kulaklık" ürününde %15 indirim fırsatı.',
    time: '3 gün önce',
    type: 'discount',
    isRead: true,
    link: '/wishlist',
  },
];

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    success('Tümü Okundu', 'Tüm bildirimler okunmuş olarak işaretlendi.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    success('Temizlendi', 'Bildirim listeniz temizlendi.');
  };

  const handleToggleSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'discount':
        return <Tag className="w-5 h-5 text-emerald-400" />;
      case 'order':
        return <Truck className="w-5 h-5 text-blue-400" />;
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'system':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bildirim Merkezi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Toplam <span className="font-bold text-white">{notifications.length} bildiriminiz</span> var,{' '}
            <span className="font-bold text-blue-400">{unreadCount} tanesi okunmadı</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs gap-1.5 border-[#1F2937] text-[#CBD5E1] hover:text-white"
            >
              <CheckCheck className="w-4 h-4 text-blue-400" /> Tümünü Okundu Say
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs gap-1.5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 className="w-4 h-4" /> Temizle
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
              : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
          }`}
        >
          Tümü ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
              : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
          }`}
        >
          Okunmamış ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-[#1F2937] bg-[#111827] space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[#3B82F6] mx-auto opacity-70" />
          <h3 className="text-base font-bold text-white">Bildirim Bulunmuyor</h3>
          <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto">
            {filter === 'unread'
              ? 'Okunmamış herhangi bir bildiriminiz bulunmuyor.'
              : 'Henüz yeni bir bildiriminiz yok.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !item.isRead
                  ? 'bg-[#111827] border-[#2563EB]/40 shadow-lg shadow-blue-900/10'
                  : 'bg-[#0B0F19] border-[#1F2937] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-2xl bg-black/40 border border-[#1F2937] shrink-0 mt-0.5 sm:mt-0">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#3B82F6] transition-colors truncate">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <Badge className="bg-[#2563EB] text-white text-[9px] px-2 py-0.5">YENİ</Badge>
                    )}
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed">{item.description}</p>
                  <span className="text-[10px] text-[#94A3B8] font-medium block pt-1">{item.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-[#1F2937] pt-3 sm:pt-0">
                {item.link && (
                  <Link to={item.link}>
                    <Button variant="outline" size="sm" className="text-xs h-8 px-3 border-[#1F2937]">
                      Detay
                    </Button>
                  </Link>
                )}

                <button
                  onClick={() => handleToggleSingleRead(item.id)}
                  className="p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
                  title={item.isRead ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
                >
                  <CheckCheck className={`w-4 h-4 ${item.isRead ? 'text-blue-500' : 'text-[#CBD5E1]'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back button */}
      <div className="pt-4 border-t border-[#1F2937]">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};
