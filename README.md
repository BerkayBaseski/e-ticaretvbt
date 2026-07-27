# Modern E-Ticaret Frontend (Vite + React + TypeScript)

Bu proje, uçtan uca mock API destekli, performanslı, erişilebilir ve modern bir e-ticaret web uygulaması frontend'idir.

---

## 🛠️ Kurulum Adımları

1. **Bağımlılıkları Kurun**:
   ```bash
   npm install
   ```

2. **Çevre Değişkenlerini Ayarlayın**:
   `.env.example` dosyasını kopyalayarak `.env` oluşturun:
   ```bash
   cp .env.example .env
   ```

3. **Geliştirme Sunucusunu Başlatın**:
   ```bash
   npm run dev
   ```

4. **Production Build Alın**:
   ```bash
   npm run build
   ```

---

## 🏗️ Teknoloji Seçim Gerekçesi & Mimarı Açıklaması

- **Vite + React 18 + TypeScript (Strict Mode)**: Hızlı HMR (Hot Module Replacement), derleme performansı ve tip güvenliğini maksimuma çıkarmak için tercih edildi.
- **TanStack Query v5 + Zustand**: Sunucu durumu (server state), önbellekleme ve optimistic UI güncellemeleri için TanStack Query; oturum (auth) ve sepet (cart) gibi istemci durumları (client state) için ise minimal Zustand mağazaları kuruldu.
- **Tailwind CSS + Custom Component Kütüphanesi**: Hızlı, responsive ve Light/Dark tema token'larına tam uyumlu modüler bileşenler (Button, Input, Card, Badge, Skeleton, Toast, EmptyState) geliştirildi.
- **MSW (Mock Service Worker v2)**: Backend henüz hazır değilken gerçek HTTP isteklerini tarayıcı seviyesinde intercept ederek RFC 9457 Problem Details hata standartları ile uçtan uca entegrasyon sağlandı.

---

## 🔌 Mock API'den Gerçek Backend API'sine Geçiş Rehberi

MSW Mock servisinden gerçek üretim/geliştirme backend servisine geçmek tek bir konfigürasyon adımı kadardır:

1. `.env` dosyanızdaki `VITE_API_BASE_URL` adresini gerçek backend URL'iniz ile güncelleyin:
   ```env
   VITE_API_BASE_URL=https://api.gercekbackend.com/v1
   VITE_USE_MOCK_API=false
   ```
2. Uygulama otomatik olarak MSW interceptor'ünü devre dışı bırakacak ve tüm Axios istekleri doğrudan belirtilen `VITE_API_BASE_URL` adresine yönlendirilecektir.

---

## 📱 Sayfalar & Ekran Görüntüleri

| Sayfa | Açıklama | Ekran Görüntüsü (Placeholder) |
|---|---|---|
| **Ana Sayfa (`/`)** | Banner, Kategori çipleri, öne çıkan ürünler grid'i | `![Ana Sayfa Mockup](https://via.placeholder.com/800x450?text=Ana+Sayfa+Mockup)` |
| **Arama / Filtre (`/search`)** | Kategori, fiyat aralığı, sıralama ve pagination | `![Arama Sayfası Mockup](https://via.placeholder.com/800x450?text=Arama+Sayfasi+Mockup)` |
| **Ürün Detay (`/products/:id`)** | Görsel galeri, stok, adet seçici, benzer ürünler | `![Urun Detay Mockup](https://via.placeholder.com/800x450?text=Urun+Detay+Mockup)` |
| **Sepet (`/cart`)** | Ürün listesi, adet değişimi, sipariş özeti | `![Sepet Mockup](https://via.placeholder.com/800x450?text=Sepet+Mockup)` |
| **Checkout (`/checkout`)** | Adres ve ödeme simülasyon formu (Korumalı) | `![Checkout Mockup](https://via.placeholder.com/800x450?text=Checkout+Mockup)` |
| **Sipariş Onayı (`/order-confirmation/:id`)** | Başarı mesajı & sipariş dökümü | `![Order Confirmation Mockup](https://via.placeholder.com/800x450?text=Order+Confirmation)` |
| **Sipariş Geçmişi (`/orders`)** | Sipariş listesi ve durum etiketleri (Korumalı) | `![Siparislerim Mockup](https://via.placeholder.com/800x450?text=Siparislerim+Mockup)` |
| **Profil (`/profile`)** | Kullanıcı bilgisi ve adres güncelleme (Korumalı) | `![Profil Mockup](https://via.placeholder.com/800x450?text=Profil+Mockup)` |
