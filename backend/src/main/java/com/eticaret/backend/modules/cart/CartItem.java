package com.eticaret.backend.modules.cart;

import com.eticaret.backend.modules.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    private String id;

    private String userId;

    private String productId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_ref_id")
    private Product product;

    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}