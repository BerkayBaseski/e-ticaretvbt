# E-Ticaret Luxury Monorepo Structure

Bu proje, net **Frontend** ve **Backend** mimari ayrımına sahip modern bir e-ticaret uygulamasıdır.

```
/
├── frontend/             # Aktif Frontend Uygulaması (Vite + React 19 + TypeScript + Tailwind)
│   ├── src/              # Uygulama kaynak kodları & FSD mimarisi
│   ├── public/           # Statik varlıklar & MSW mock worker
│   ├── package.json      # Frontend bağımlılıkları & derleme komutları
│   └── tsconfig.json     # TypeScript konfigürasyonu
│
├── backend/              # Gelecekteki Backend geliştirmeleri için ayrılmış alan
│   └── README.md         # Backend entegrasyon ve kılavuz dokümanı
│
├── docs/                 # Mimari dokümantasyon
│   └── ARCHITECTURE.md
│
├── README.md             # Ana proje dokümantasyonu
└── .gitignore            # Git dışlama kuralları
```

---

## 🛠️ Hızlı Başlangıç

Proje kök dizininden komut çalıştırarak uygulamayı başlatabilirsiniz:

1. **Bağımlılıkları Kurun (Frontend)**:
   ```bash
   npm --prefix frontend install
   ```

2. **Geliştirme Sunucusunu Başlatın**:
   ```bash
   npm run dev
   ```

3. **Production Build Alın**:
   ```bash
   npm run build
   ```

---

## 🏗️ Mimari Özellikler

- **Temiz Müşteri-Sunucu Ayrımı:** Sadece `/frontend` dizini aktif olarak geliştirilmekte, `/backend` dizisi gelecekteki servis entegrasyonları için ayrılmıştır.
- **Vite + React 19 + TypeScript**: Yüksek performanslı modüler frontend yapısı.
- **MSW (Mock Service Worker v2)**: Backend servisleri olmadan API katmanını tarayıcı seviyesinde simüle eden katman.
- **Geleceğe Hazır API Katmanı:** `.env` dosyasında `VITE_API_BASE_URL` değiştirilerek sıfır kod değişikliği ile gerçek backend servisine bağlanabilir.

Detaylı mimari doküman için [`/docs/ARCHITECTURE.md`](file:///c:/Users/bbase/OneDrive/Documents/GitHub/e-ticaretvbt/e-ticaretvbt/docs/ARCHITECTURE.md) dosyasını inceleyebilirsiniz.
