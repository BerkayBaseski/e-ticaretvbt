package com.eticaret.backend.modules.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getAllItems() {
        return cartItemRepository.findAll();
    }

    public CartItem addItem(CartItem item) {
        return cartItemRepository.save(item);
    }

    public CartItem updateItem(Long id, CartItem updatedItem) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sepet öğesi bulunamadı: " + id));
        item.setQuantity(updatedItem.getQuantity());
        return cartItemRepository.save(item);
    }

    public void removeItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearCart() {
        cartItemRepository.deleteAll();
    }
}