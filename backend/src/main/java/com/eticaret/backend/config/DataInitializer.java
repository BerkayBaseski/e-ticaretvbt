package com.eticaret.backend.config;

import com.eticaret.backend.modules.banner.Banner;
import com.eticaret.backend.modules.banner.BannerRepository;
import com.eticaret.backend.modules.category.Category;
import com.eticaret.backend.modules.category.CategoryRepository;
import com.eticaret.backend.modules.coupon.Coupon;
import com.eticaret.backend.modules.coupon.CouponRepository;
import com.eticaret.backend.modules.product.Product;
import com.eticaret.backend.modules.product.ProductRepository;
import com.eticaret.backend.modules.review.Review;
import com.eticaret.backend.modules.review.ReviewRepository;
import com.eticaret.backend.modules.user.Address;
import com.eticaret.backend.modules.user.User;
import com.eticaret.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private BannerRepository bannerRepository;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (categoryRepository.count() == 0) {
            seedCategoriesAndProducts();
        }
        if (couponRepository.count() == 0) {
            seedCoupons();
        }
        if (bannerRepository.count() == 0) {
            seedBanners();
        }
    }

    private void seedUsers() {
        User user1 = User.builder()
                .id("user-101")
                .email("ahmet@example.com")
                .password("password123")
                .firstName("Ahmet")
                .lastName("Yılmaz")
                .phone("+90 555 123 45 67")
                .address(Address.builder()
                        .street("Atatürk Cad. No: 42")
                        .city("İstanbul")
                        .state("Kadıköy")
                        .zipCode("34710")
                        .country("Türkiye")
                        .build())
                .build();
                
        User user2 = User.builder()
                .id("user-admin")
                .email("admin@novastore.com")
                .password("admin123")
                .firstName("Admin")
                .lastName("Kullanıcı")
                .phone("+90 555 999 99 99")
                .address(Address.builder()
                        .street("Plaza Sokak")
                        .city("İstanbul")
                        .state("Şişli")
                        .zipCode("34000")
                        .country("Türkiye")
                        .build())
                .build();
                
        userRepository.saveAll(List.of(user1, user2));
    }

    private void seedCoupons() {
        List<Coupon> coupons = List.of(
            Coupon.builder()
                .id(UUID.randomUUID().toString())
                .code("HOSGELDIN")
                .title("İlk Alışverişe Özel %15 İndirim")
                .description("Yeni üyelerimize özel ilk siparişte geçerli %15 indirim.")
                .discountType(Coupon.DiscountType.PERCENTAGE)
                .discountValue(15.0)
                .minOrderAmount(200.0)
                .maxDiscountAmount(150.0)
                .validFrom(LocalDateTime.now().minusDays(1))
                .validUntil(LocalDateTime.now().plusMonths(3))
                .isActive(true)
                .build(),
            Coupon.builder()
                .id(UUID.randomUUID().toString())
                .code("YAZ2024")
                .title("Yaza Merhaba: 100 TL İndirim")
                .description("500 TL ve üzeri alışverişlerde net 100 TL indirim fırsatı.")
                .discountType(Coupon.DiscountType.FIXED)
                .discountValue(100.0)
                .minOrderAmount(500.0)
                .validFrom(LocalDateTime.now().minusDays(1))
                .validUntil(LocalDateTime.now().plusMonths(1))
                .isActive(true)
                .build(),
            Coupon.builder()
                .id(UUID.randomUUID().toString())
                .code("KARGOBEDAVA")
                .title("Bedava Kargo Fırsatı")
                .description("Tüm siparişlerde kargo bizden.")
                .discountType(Coupon.DiscountType.FREE_SHIPPING)
                .discountValue(0.0)
                .minOrderAmount(0.0)
                .validFrom(LocalDateTime.now().minusDays(1))
                .validUntil(LocalDateTime.now().plusMonths(6))
                .isActive(true)
                .build(),
            Coupon.builder()
                .id(UUID.randomUUID().toString())
                .code("ELEKTRONIK10")
                .title("Elektronikte %10 İndirim")
                .description("Sadece elektronik kategorisinde geçerli %10 indirim.")
                .discountType(Coupon.DiscountType.PERCENTAGE)
                .discountValue(10.0)
                .minOrderAmount(1000.0)
                .maxDiscountAmount(500.0)
                .validFrom(LocalDateTime.now().minusDays(1))
                .validUntil(LocalDateTime.now().plusMonths(1))
                .applicableCategory("cat-electronics")
                .isActive(true)
                .build()
        );
        couponRepository.saveAll(coupons);
    }

    private void seedBanners() {
        List<Banner> banners = List.of(
            Banner.builder()
                .id(UUID.randomUUID().toString())
                .title("Yaz İndirimleri Başladı!")
                .subtitle("Sezonun En Trend Ürünleri")
                .description("Seçili ürünlerde %50'ye varan dev indirimleri kaçırmayın.")
                .imageUrl("https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80")
                .linkUrl("/search?q=yaz")
                .buttonText("Hemen Keşfet")
                .badgeText("BÜYÜK İNDİRİM")
                .position(Banner.BannerPosition.HERO)
                .sortOrder(1)
                .isActive(true)
                .build(),
            Banner.builder()
                .id(UUID.randomUUID().toString())
                .title("Yeni Teknoloji, Yeni Heyecan")
                .subtitle("Elektronikte Fırsat Zamanı")
                .description("Akıllı telefonlardan dizüstü bilgisayarlara en yeni ürünler NovaStore'da.")
                .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80")
                .linkUrl("/search?category=cat-electronics")
                .buttonText("İncele")
                .position(Banner.BannerPosition.HERO)
                .sortOrder(2)
                .isActive(true)
                .build(),
            Banner.builder()
                .id(UUID.randomUUID().toString())
                .title("Evine Yenilik Kat")
                .subtitle("Dekorasyon ve Mobilya")
                .description("Evinizin havasını değiştirecek şık ve modern mobilyalar.")
                .imageUrl("https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=1200&q=80")
                .linkUrl("/search?category=cat-home")
                .buttonText("Alışverişe Başla")
                .position(Banner.BannerPosition.HERO)
                .sortOrder(3)
                .isActive(true)
                .build()
        );
        bannerRepository.saveAll(banners);
    }

    private void seedCategoriesAndProducts() {
        // Categories
        Category cat1 = createCategory("cat-electronics", "Elektronik", "elektronik", "Akıllı telefonlar, bilgisayarlar, kulaklıklar.", "Smartphone", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80", 1);
        Category cat2 = createCategory("cat-fashion", "Giyim & Moda", "giyim-moda", "Erkek ve kadın giyim, ayakkabı ve aksesuar.", "Shirt", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80", 2);
        Category cat3 = createCategory("cat-home", "Ev & Yaşam", "ev-yasam", "Mobilya, dekorasyon, mutfak gereçleri.", "Home", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", 3);
        Category cat4 = createCategory("cat-sports", "Spor & Outdoor", "spor-outdoor", "Antrenman ekipmanları, kamp malzemeleri.", "Activity", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", 4);
        Category cat5 = createCategory("cat-cosmetics", "Kozmetik & Bakım", "kozmetik-bakim", "Cilt bakımı, parfümler ve kişisel bakım.", "Sparkles", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", 5);
        Category cat6 = createCategory("cat-books", "Kitap & Hobi", "kitap-hobi", "Kitaplar, kutu oyunları, kırtasiye.", "Book", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80", 6);
        Category cat7 = createCategory("cat-supermarket", "Süpermarket", "supermarket", "Temel gıda, temizlik ürünleri ve atıştırmalıklar.", "ShoppingCart", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", 7);
        Category cat8 = createCategory("cat-baby", "Bebek & Çocuk", "bebek-cocuk", "Bebek bezi, oyuncak ve çocuk giyim.", "Baby", "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80", 8);

        List<Category> categories = List.of(cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8);
        categoryRepository.saveAll(categories);

        // Generate Products
        List<Product> products = new ArrayList<>();
        
        // 1. Elektronik Products (15 products)
        products.addAll(generateElectronics(cat1));
        
        // 2. Moda Products (15 products)
        products.addAll(generateFashion(cat2));
        
        // 3. Ev Yaşam Products (10 products)
        products.addAll(generateHome(cat3));
        
        // 4. Diğer Kategoriler (15 products)
        products.addAll(generateOthers(cat4, cat5, cat6, cat7, cat8));

        productRepository.saveAll(products);

        // Generate Reviews
        List<Review> reviews = new ArrayList<>();
        for (Product p : products) {
            int reviewCount = random.nextInt(4) + 1; // 1 to 4 reviews per product
            for (int i = 0; i < reviewCount; i++) {
                double rating = 3.0 + (random.nextDouble() * 2.0); // 3.0 to 5.0
                reviews.add(Review.builder()
                        .id(UUID.randomUUID().toString())
                        .productId(p.getId())
                        .userId(i % 2 == 0 ? "user-101" : "user-102")
                        .userName(i % 2 == 0 ? "Ahmet Y." : "Ayşe K.")
                        .userAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + random.nextInt(1000))
                        .rating(Math.round(rating * 10.0) / 10.0)
                        .comment(getRandomComment(rating))
                        .helpfulCount(random.nextInt(20))
                        .build());
            }
            // Update product rating and review count
            p.setReviewCount(reviewCount);
            p.setRating(reviews.stream().filter(r -> r.getProductId().equals(p.getId())).mapToDouble(Review::getRating).average().orElse(5.0));
        }
        productRepository.saveAll(products); // re-save to update ratings
        reviewRepository.saveAll(reviews);
    }

    private Category createCategory(String id, String name, String slug, String desc, String icon, String image, int sortOrder) {
        return Category.builder()
                .id(id).name(name).slug(slug).description(desc).icon(icon).image(image).sortOrder(sortOrder).itemCount(10)
                .build();
    }

    private List<Product> generateElectronics(Category cat) {
        List<Product> list = new ArrayList<>();
        String[] brands = {"Apple", "Samsung", "Sony", "Dell", "HP", "Asus", "JBL", "Xiaomi"};
        String[] colors = {"Siyah", "Beyaz", "Gümüş", "Uzay Grisi"};
        
        for (int i = 1; i <= 15; i++) {
            String brand = brands[random.nextInt(brands.length)];
            double price = 1000 + random.nextInt(40000);
            boolean isDiscounted = random.nextBoolean();
            double originalPrice = isDiscounted ? price * (1.1 + random.nextDouble() * 0.4) : price;
            int discountPercent = isDiscounted ? (int) Math.round((1 - (price / originalPrice)) * 100) : 0;
            
            list.add(Product.builder()
                    .id("prod-elec-" + i)
                    .name(brand + " Profesyonel Cihaz " + i)
                    .slug("elektronik-" + brand.toLowerCase() + "-" + i)
                    .description("Yüksek performanslı " + brand + " cihazı. En yeni teknolojilerle donatılmıştır.")
                    .price((double) Math.round(price))
                    .originalPrice((double) Math.round(originalPrice))
                    .discountPercent(discountPercent)
                    .currency("TRY")
                    .categoryId(cat.getId())
                    .categoryName(cat.getName())
                    .brand(brand)
                    .sku("ELC-" + brand.toUpperCase().substring(0,2) + "-" + i)
                    .colorOptions(Set.of("Siyah", "Beyaz"))
                    .images(List.of("https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"))
                    .stock(random.nextInt(100) + 5)
                    .isNew(random.nextInt(10) > 7)
                    .isFeatured(random.nextInt(10) > 6)
                    .isBestseller(random.nextInt(10) > 7)
                    .soldCount(random.nextInt(1000))
                    .viewCount(random.nextInt(5000))
                    .tags(Set.of("Elektronik", brand, "Teknoloji"))
                    .specs(Map.of("Garanti", "2 Yıl", "Bağlantı", "Kablosuz"))
                    .build());
        }
        return list;
    }

    private List<Product> generateFashion(Category cat) {
        List<Product> list = new ArrayList<>();
        String[] brands = {"Nike", "Adidas", "Zara", "Mavi", "Koton", "Levi's", "Puma"};
        String[] sizes = {"XS", "S", "M", "L", "XL", "XXL"};
        
        for (int i = 1; i <= 15; i++) {
            String brand = brands[random.nextInt(brands.length)];
            double price = 200 + random.nextInt(3000);
            boolean isDiscounted = random.nextBoolean();
            double originalPrice = isDiscounted ? price * (1.2 + random.nextDouble() * 0.5) : price;
            int discountPercent = isDiscounted ? (int) Math.round((1 - (price / originalPrice)) * 100) : 0;

            list.add(Product.builder()
                    .id("prod-fash-" + i)
                    .name(brand + " Sezon Trendi Ürün " + i)
                    .slug("moda-" + brand.toLowerCase() + "-" + i)
                    .description("Yeni sezon " + brand + " koleksiyonundan şık ve rahat bir parça.")
                    .price((double) Math.round(price))
                    .originalPrice((double) Math.round(originalPrice))
                    .discountPercent(discountPercent)
                    .currency("TRY")
                    .categoryId(cat.getId())
                    .categoryName(cat.getName())
                    .brand(brand)
                    .sku("MOD-" + brand.toUpperCase().substring(0,2) + "-" + i)
                    .sizeOptions(Set.of("S", "M", "L", "XL"))
                    .colorOptions(Set.of("Siyah", "Mavi", "Kırmızı"))
                    .images(List.of("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80"))
                    .stock(random.nextInt(200) + 20)
                    .isNew(random.nextInt(10) > 6)
                    .isFeatured(random.nextInt(10) > 7)
                    .isBestseller(random.nextInt(10) > 6)
                    .soldCount(random.nextInt(2000))
                    .viewCount(random.nextInt(8000))
                    .tags(Set.of("Moda", brand, "Giyim"))
                    .specs(Map.of("Kumaş", "%100 Pamuk", "Kalıp", "Regular Fit"))
                    .build());
        }
        return list;
    }

    private List<Product> generateHome(Category cat) {
        List<Product> list = new ArrayList<>();
        String[] brands = {"IKEA", "Karaca", "Paşabahçe", "English Home", "Madame Coco"};
        
        for (int i = 1; i <= 10; i++) {
            String brand = brands[random.nextInt(brands.length)];
            double price = 100 + random.nextInt(5000);
            
            list.add(Product.builder()
                    .id("prod-home-" + i)
                    .name(brand + " Modern Ev Eşyası " + i)
                    .slug("ev-" + brand.toLowerCase().replace(" ", "-") + "-" + i)
                    .description("Evinize şıklık katacak " + brand + " tasarımı.")
                    .price((double) Math.round(price))
                    .originalPrice((double) Math.round(price * 1.3))
                    .discountPercent(23)
                    .currency("TRY")
                    .categoryId(cat.getId())
                    .categoryName(cat.getName())
                    .brand(brand)
                    .sku("EV-" + brand.toUpperCase().substring(0,2) + "-" + i)
                    .images(List.of("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"))
                    .stock(random.nextInt(50) + 10)
                    .isNew(random.nextBoolean())
                    .isFeatured(random.nextBoolean())
                    .soldCount(random.nextInt(500))
                    .viewCount(random.nextInt(2000))
                    .build());
        }
        return list;
    }

    private List<Product> generateOthers(Category cat4, Category cat5, Category cat6, Category cat7, Category cat8) {
        List<Product> list = new ArrayList<>();
        Category[] cats = {cat4, cat5, cat6, cat7, cat8};
        String[] brands = {"Decathlon", "L'Oreal", "Penguen", "Ülker", "Prima"};
        
        for (int i = 1; i <= 15; i++) {
            int index = i % cats.length;
            Category cat = cats[index];
            String brand = brands[index];
            double price = 50 + random.nextInt(1000);
            
            list.add(Product.builder()
                    .id("prod-other-" + i)
                    .name(brand + " Premium Ürün " + i)
                    .slug("diger-" + cat.getSlug() + "-" + i)
                    .description(cat.getName() + " kategorisinin en sevilen ürünlerinden.")
                    .price((double) Math.round(price))
                    .originalPrice((double) Math.round(price))
                    .discountPercent(0)
                    .currency("TRY")
                    .categoryId(cat.getId())
                    .categoryName(cat.getName())
                    .brand(brand)
                    .sku("OTH-" + i)
                    .images(List.of("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"))
                    .stock(random.nextInt(100) + 50)
                    .isNew(random.nextBoolean())
                    .isFeatured(random.nextBoolean())
                    .soldCount(random.nextInt(300))
                    .viewCount(random.nextInt(1000))
                    .build());
        }
        return list;
    }

    private String getRandomComment(double rating) {
        if (rating >= 4.5) return "Kesinlikle harika bir ürün, çok memnun kaldım. Tavsiye ederim!";
        if (rating >= 3.5) return "Fiyat performans ürünü, beklentilerimi karşıladı.";
        return "İdare eder, kargo biraz yavaştı.";
    }
}
