# 🛒 NovaStore | 2026 Team Project

> Java Spring Boot ve React kullanılarak geliştirilen, modern ve ölçeklenebilir bir full-stack e-ticaret uygulaması.

NovaStore, üniversite ekip çalışması kapsamında geliştirilen bir e-ticaret platformudur. Projede backend ve frontend ekipleri paralel olarak çalışarak gerçek bir yazılım geliştirme sürecini deneyimlemeyi amaçlamıştır.

Uygulama; kullanıcı yönetimi, ürün keşfi, sepet işlemleri, kimlik doğrulama ve sipariş süreçlerini RESTful API mimarisi üzerinden bir araya getirir.

Backend ve frontend birbirinden bağımsız geliştirilmiş ve HTTP tabanlı REST API'ler aracılığıyla iletişim sağlanmıştır. Geliştirme sürecinde GitHub üzerinden branch, Pull Request ve code review süreçleri kullanılarak ekip çalışmasına dayalı bir geliştirme akışı uygulanmıştır.

---

# 📌 Proje Genel Bakış

| Katman | Teknoloji | Açıklama |
|----------|-----------|----------|
| **Backend** | Java 21 • Spring Boot • Spring Security • Spring Data JPA • JWT • Maven | REST API ve iş kuralları |
| **Frontend** | React 18 • TypeScript • Vite | Modern web arayüzü |
| **UI** | Tailwind CSS | Responsive kullanıcı deneyimi |
| **State Management** | TanStack Query • Zustand | Sunucu ve istemci veri yönetimi |
| **Database** | PostgreSQL | Kalıcı veri yönetimi |
| **Development** | Git • GitHub | Sürüm kontrolü ve ekip çalışması |

---

# 👥 Takım

| Üye | Rol | Sorumluluk |
|------|-----|------------|
| **Aysun Gözaydın** | Backend Developer | User • Authentication • JWT Security • Payment • Notification |
| **Eslem Şehla Akar** | Backend Developer | Backend Development |
| **Berkay Başeski** | Frontend Developer & Repository Maintainer | Frontend • Repository Management |
| **Damla Hilal Erden** | QA Support | Manual Testing • Test Scenarios |

### GitHub

- **Aysun Gözaydın** → https://github.com/Aysun-Gozaydin
- **Eslem Şehla Akar** → https://github.com/sehla32
- **Berkay Başeski** → https://github.com/BerkayBaseski
- **Damla Hilal Erden** → https://github.com/Damla914

### LinkedIn

- **Aysun Gözaydın** → https://www.linkedin.com/in/aysun-gozaydin-975707322
- **Eslem Şehla Akar** → https://www.linkedin.com/in/eslem-şehla-akar-b7272528a/
- **Berkay Başeski** → https://www.linkedin.com/in/berkaybaseski
- **Damla Hilal Erden** → https://www.linkedin.com/in/damla-erden/

---

# 🌿 Geliştirme Süreci

Kod geliştirme süreci GitHub tabanlı ekip çalışması modeliyle yürütüldü.

- Her ekip üyesi kendi branch'i üzerinde geliştirme yaptı.
- Geliştirilen özellikler Pull Request üzerinden paylaşıldı.
- Kodlar incelendikten sonra ana dala (main) aktarıldı.
- Frontend ve backend geliştirmeleri REST API sözleşmesi üzerinden paralel ilerledi.
- Her modül ekip içindeki sorumluluk dağılımına göre bağımsız geliştirildi.

---

# 🏗️ Mimari

Backend tarafında katmanlı mimari tercih edilmiştir.

```text
                HTTP Request
                     │
                     ▼
             Controller Layer
                     │
                     ▼
              Service Layer
                     │
                     ▼
            Repository Layer
                     │
                     ▼
               PostgreSQL
```

Bu yapı sayesinde;

- İş kuralları servis katmanında toplandı.
- Veritabanı işlemleri Repository katmanında yönetildi.
- Controller katmanı yalnızca istemci ile haberleşmeden sorumlu tutuldu.
- Katmanlar arası bağımlılık minimum seviyede tutulmaya çalışıldı.

---

# 💡 Proje Kapsamı

Platform temel e-ticaret akışlarını kapsayacak şekilde tasarlanmıştır.

### Backend

- Kullanıcı yönetimi
- Kimlik doğrulama
- JWT tabanlı güvenlik
- Ödeme yönetimi
- Bildirim sistemi
- REST API

### Frontend

- Ürün listeleme
- Ürün detay sayfası
- Arama ve filtreleme
- Sepet
- Checkout
- Profil yönetimi
- Sipariş geçmişi

Frontend geliştirme sürecinde Mock Service Worker (MSW) kullanılarak backend tamamlanana kadar servisler simüle edilmiş, backend geliştirmeleri ilerledikçe gerçek Spring Boot API'lerine geçiş hedeflenmiştir.

---# 📦 Geliştirilen Modüller

Backend geliştirme süreci modüler yapı esas alınarak ilerletildi. Her modül bağımsız geliştirilebilir ve sürdürülebilir olacak şekilde tasarlanırken, katmanlar arasında temiz bir sorumluluk dağılımı hedeflendi.

---

## 👤 User Management

Kullanıcı işlemleri için temel yönetim altyapısı oluşturuldu.

**Kapsam**

- User Entity
- User Repository
- User Service
- User Controller
- DTO Yapıları
- Kullanıcı bilgilerini listeleme
- Kullanıcı sorgulama
- Profil güncelleme

---

## 🔐 Authentication

Kimlik doğrulama işlemleri JWT tabanlı güvenlik yapısı üzerine kuruldu.

**Desteklenen İşlemler**

- Register
- Login
- JWT Token
- Refresh Token
- Me Endpoint

Bu yapı sayesinde korunan endpointlere yalnızca doğrulanmış kullanıcıların erişebilmesi sağlandı.

---

## 🛡️ Security

Spring Security kullanılarak uygulamanın güvenlik katmanı oluşturuldu.

**Bileşenler**

- SecurityConfig
- JWT Authentication Filter
- JWT Service
- CustomUserDetailsService
- AuthenticationEntryPoint

Yetkilendirme işlemleri Security Filter Chain üzerinden yönetilmektedir.

---

## 💳 Payment

Temel ödeme yönetimi altyapısı geliştirildi.

**İşlemler**

- Ödeme oluşturma
- Ödeme listeleme
- Ödeme detay görüntüleme
- Ödeme durumunu güncelleme

---

## 🔔 Notification

Kullanıcı bildirimleri için bağımsız bir servis oluşturuldu.

**İşlemler**

- Bildirim oluşturma
- Bildirim listeleme
- Okundu / okunmadı durumu
- Bildirimi okundu olarak işaretleme

---

# 🎨 Frontend

Frontend tarafı React ekosistemi kullanılarak geliştirildi.

Öne çıkan sayfalar

- Ana Sayfa
- Ürün Listeleme
- Ürün Detay
- Arama
- Filtreleme
- Sepet
- Checkout
- Profil
- Sipariş Geçmişi

Projede Vite altyapısı tercih edilmiş, TypeScript ile tip güvenliği sağlanmış, TanStack Query ve Zustand kullanılarak veri yönetimi daha sürdürülebilir hâle getirilmiştir.

---

# 🧪 Test Süreci

Proje geliştirilirken temel iş akışlarının doğrulanmasına yönelik test senaryoları hazırlanmıştır.

Kontrol edilen başlıca süreçler

- Kullanıcı kayıt işlemleri
- Kullanıcı giriş işlemleri
- JWT doğrulama
- REST API endpoint kontrolleri
- Payment işlemleri
- Notification işlemleri
- Backend build doğrulaması

---

# 📂 Proje Yapısı

```text
e-ticaretvbt
│
├── backend
│   ├── common
│   ├── config
│   ├── modules
│   │
│   ├── auth
│   ├── user
│   ├── payment
│   ├── notification
│   ├── product
│   ├── category
│   ├── cart
│   ├── wishlist
│   ├── order
│   └── review
│
├── frontend
│
├── docs
│
└── tests
```

---

# 🚀 Kurulum

## Backend

```bash
git clone https://github.com/BerkayBaseski/e-ticaretvbt.git

cd backend

mvn clean install

mvn spring-boot:run
```

Backend

```
http://localhost:8080
```

---

## Frontend

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

---

# 📡 API

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me
```

### User

```
GET    /api/users
GET    /api/users/{id}
GET    /api/users/search
```

### Payment

```
GET    /api/payments
GET    /api/payments/{id}
PATCH  /api/payments/{id}/status
```

### Notification

```
GET    /api/notifications
GET    /api/notifications/{id}
PATCH  /api/notifications/{id}/read
```

---

# 📚 Kullanılan Teknolojiler

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- Lombok
- Validation
- PostgreSQL

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand
- MSW

### Development

- Git
- GitHub
- RESTful API

---

# ✨ Son Not

Bu proje yalnızca bir ders çalışması değil, ekip içinde görev paylaşımı, Git tabanlı geliştirme süreci ve ortak bir kod tabanı üzerinde çalışma deneyimi kazanmayı amaçlayan bir uygulama olarak geliştirildi.

Geliştirme boyunca her ekip üyesi kendi sorumluluk alanına odaklanarak ilerledi; değişiklikler Pull Request üzerinden yönetildi ve proje tek bir kod tabanında birleştirildi. Süreç boyunca hem teknik becerilerin hem de ekip içi koordinasyonun geliştirilmesi hedeflendi.

Bu proje; Java Spring Boot ile backend geliştirme, React tabanlı modern web arayüzü oluşturma ve GitHub üzerinden ekip çalışması yürütme konularında kapsamlı bir uygulama deneyimi sunmuştur.
