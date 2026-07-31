package com.eticaret.backend.modules.wishlist;

import com.eticaret.backend.modules.product.Product;
import com.eticaret.backend.modules.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getWishlistProducts(String userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(Wishlist::getProduct)
                .filter(p -> p != null)
                .collect(Collectors.toList());
    }

    public List<Product> addToWishlist(String userId, String productId) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isEmpty()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + productId));

            Wishlist wishlist = Wishlist.builder()
                    .id("wish-" + UUID.randomUUID().toString().substring(0, 8))
                    .userId(userId)
                    .productId(productId)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
        return getWishlistProducts(userId);
    }

    public List<Product> removeFromWishlist(String userId, String productId) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        existing.ifPresent(w -> wishlistRepository.delete(w));
        return getWishlistProducts(userId);
    }
}
