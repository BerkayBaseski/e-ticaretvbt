package com.eticaret.backend.modules.cart;

import com.eticaret.backend.modules.product.Product;
import com.eticaret.backend.modules.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartResponseDto getCart(String userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);

        double subtotal = items.stream().mapToDouble(CartItem::getTotalPrice).sum();
        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();
        double shipping = (subtotal > 1000 || subtotal == 0) ? 0.0 : 49.0;
        double discount = (subtotal > 2000) ? 150.0 : 0.0;
        double total = Math.max(0.0, subtotal + shipping - discount);

        return CartResponseDto.builder()
                .items(items)
                .subtotal(subtotal)
                .shipping(shipping)
                .discount(discount)
                .total(total)
                .totalItems(totalItems)
                .build();
    }

    public CartResponseDto addItem(String userId, String productId, Integer quantity) {
        int qty = (quantity != null && quantity > 0) ? quantity : 1;
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + productId));

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + qty;
            item.setQuantity(newQty);
            item.setTotalPrice(newQty * item.getUnitPrice());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .id("item-" + UUID.randomUUID().toString().substring(0, 8))
                    .userId(userId)
                    .productId(productId)
                    .product(product)
                    .quantity(qty)
                    .unitPrice(product.getPrice())
                    .totalPrice(product.getPrice() * qty)
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(userId);
    }

    public CartResponseDto updateQuantity(String userId, String itemIdOrProductId, Integer quantity) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(itemIdOrProductId);
        if (itemOpt.isEmpty()) {
            itemOpt = cartItemRepository.findByUserIdAndProductId(userId, itemIdOrProductId);
        }

        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            if (quantity == null || quantity <= 0) {
                cartItemRepository.delete(item);
            } else {
                item.setQuantity(quantity);
                item.setTotalPrice(item.getUnitPrice() * quantity);
                cartItemRepository.save(item);
            }
        }

        return getCart(userId);
    }

    public CartResponseDto removeItem(String userId, String itemIdOrProductId) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(itemIdOrProductId);
        if (itemOpt.isEmpty()) {
            itemOpt = cartItemRepository.findByUserIdAndProductId(userId, itemIdOrProductId);
        }

        itemOpt.ifPresent(cartItem -> cartItemRepository.delete(cartItem));
        return getCart(userId);
    }

    @Transactional
    public void clearCart(String userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}