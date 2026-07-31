package com.eticaret.backend.modules.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    private static final String DEFAULT_USER_ID = "user-101";

    @GetMapping
    public CartResponseDto getCart() {
        return cartService.getCart(DEFAULT_USER_ID);
    }

    @PostMapping("/items")
    public CartResponseDto addItem(@RequestBody Map<String, Object> payload) {
        String productId = (String) payload.get("productId");
        Integer quantity = payload.get("quantity") != null ? ((Number) payload.get("quantity")).intValue() : 1;
        return cartService.addItem(DEFAULT_USER_ID, productId, quantity);
    }

    @PatchMapping("/items/{id}")
    public CartResponseDto updateQuantity(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        Integer quantity = payload.get("quantity") != null ? ((Number) payload.get("quantity")).intValue() : 1;
        return cartService.updateQuantity(DEFAULT_USER_ID, id, quantity);
    }

    @DeleteMapping("/items/{id}")
    public CartResponseDto removeItem(@PathVariable String id) {
        return cartService.removeItem(DEFAULT_USER_ID, id);
    }
}