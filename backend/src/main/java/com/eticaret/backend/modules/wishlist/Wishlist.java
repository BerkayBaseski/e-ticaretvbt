package com.eticaret.backend.modules.wishlist;

import com.eticaret.backend.modules.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wishlists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    private String id;

    private String userId;

    private String productId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_ref_id")
    private Product product;
}
