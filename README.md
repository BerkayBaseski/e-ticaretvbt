# Modern E-Ticaret Projesi

Bu proje, modern teknolojiler kullanılarak geliştirilen tam yığın (Full Stack) bir e-ticaret uygulamasıdır. Frontend tarafında React ve TypeScript, backend tarafında ise Java ve Spring Boot kullanılmaktadır. Geliştirme sürecinde frontend ve backend ekipleri eş zamanlı çalışarak RESTful API üzerinden haberleşmektedir.

---

# 🎨 Frontend (Vite + React + TypeScript)

Frontend tarafı, performanslı, erişilebilir ve modern bir kullanıcı deneyimi sunacak şekilde geliştirilmiştir.

## 🛠️ Kurulum Adımları

1. **Bağımlılıkları Kurun**
   ```bash
   npm install
   ```

2. **Çevre Değişkenlerini Ayarlayın**

   `.env.example` dosyasını kopyalayarak `.env` oluşturun.

   ```bash
   cp .env.example .env
   ```

3. **Geliştirme Sunucusunu Başlatın**

   ```bash
   npm run dev
   ```

4. **Production Build Alın**

   ```bash
   npm run build
   ```

---

## 🏗️ Frontend Teknolojileri

- **Vite + React 18 + TypeScript (Strict Mode)**: Hızlı geliştirme süreci, yüksek performans ve tip güvenliği sağlar.
- **TanStack Query v5 + Zustand**: Sunucu verilerinin yönetimi, önbellekleme ve istemci durum yönetimi için kullanılır.
- **Tailwind CSS + Custom Component Library**: Responsive ve yeniden kullanılabilir arayüz bileşenleri oluşturulmuştur.
- **MSW (Mock Service Worker v2)**: Backend geliştirme süreci tamamlanana kadar gerçek API davranışını simüle etmek amacıyla kullanılır.

---

# ☕ Backend (Java + Spring Boot)

Backend tarafı Java ve Spring Boot kullanılarak RESTful API mimarisi ile geliştirilmektedir. Uygulamanın iş kuralları, veritabanı işlemleri, kimlik doğrulama ve yetkilendirme süreçleri bu katmanda yönetilmektedir.

## 🛠️ Kullanılan Teknolojiler

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA (Hibernate)
- PostgreSQL
- Maven
- Lombok
- Spring Validation
- Spring Security
- JWT Authentication
- Swagger (OpenAPI)
- Git & GitHub

---

## 🏗️ Backend Mimarisi

Katmanlı (Layered) mimari kullanılmaktadır.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

Bu yapı sayesinde kodun okunabilirliği, sürdürülebilirliği ve test edilebilirliği artırılmaktadır.

---

## ⚙️ Backend Özellikleri

- RESTful API
- JWT ile Kimlik Doğrulama (Authentication)
- Rol Bazlı Yetkilendirme (User / Admin)
- Ürün Yönetimi
- Kategori Yönetimi
- Sepet Yönetimi
- Favoriler (Wishlist)
- Sipariş Yönetimi
- Kullanıcı Profil Yönetimi
- Veri Doğrulama (Validation)
- Global Exception Handling

---

## 🔌 Mock API'den Gerçek Backend API'sine Geçiş

Frontend geliştirme sürecinde kullanılan MSW Mock API, backend tamamlandıktan sonra kolayca gerçek API'ye yönlendirilebilir.

`.env` dosyasında aşağıdaki ayarlar güncellenmelidir:

```env
VITE_API_BASE_URL=https://api.gercekbackend.com/v1
VITE_USE_MOCK_API=false
```

Bu değişiklik sonrasında uygulama, tüm HTTP isteklerini Spring Boot backend servisine yönlendirecektir.

---

## 📱 Sayfalar

| Sayfa | Açıklama |
|---|---|
| **Ana Sayfa (`/`)** | Banner, kategoriler ve öne çıkan ürünler |
| **Arama / Filtre (`/search`)** | Ürün arama, filtreleme ve sıralama |
| **Ürün Detay (`/products/:id`)** | Ürün bilgileri, görseller ve benzer ürünler |
| **Sepet (`/cart`)** | Sepet yönetimi ve sipariş özeti |
| **Checkout (`/checkout`)** | Adres ve ödeme işlemleri |
| **Sipariş Onayı (`/order-confirmation/:id`)** | Sipariş başarı ekranı |
| **Sipariş Geçmişi (`/orders`)** | Kullanıcının geçmiş siparişleri |
| **Profil (`/profile`)** | Kullanıcı bilgileri ve adres yönetimi |
