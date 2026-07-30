package com.eticaret.backend.modules.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public List<CartItem> getCart() {
        return cartService.getAllItems();
    }

    @PostMapping
    public CartItem addToCart(@RequestBody CartItem item) {
        return cartService.addItem(item);
    }

    @PutMapping("/{id}")
    public CartItem updateCartItem(@PathVariable Long id, @RequestBody CartItem item) {
        return cartService.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void removeFromCart(@PathVariable Long id) {
        cartService.removeItem(id);
    }

    @DeleteMapping
    public void clearCart() {
        cartService.clearCart();
    }
}