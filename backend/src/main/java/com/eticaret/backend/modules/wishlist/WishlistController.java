package com.eticaret.backend.modules.wishlist;

import com.eticaret.backend.modules.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    private static final String DEFAULT_USER_ID = "user-101";

    @GetMapping
    public List<Product> getWishlist() {
        return wishlistService.getWishlistProducts(DEFAULT_USER_ID);
    }

    @PostMapping("/{productId}")
    public List<Product> addToWishlist(@PathVariable String productId) {
        return wishlistService.addToWishlist(DEFAULT_USER_ID, productId);
    }

    @DeleteMapping("/{productId}")
    public List<Product> removeFromWishlist(@PathVariable String productId) {
        return wishlistService.removeFromWishlist(DEFAULT_USER_ID, productId);
    }
}
