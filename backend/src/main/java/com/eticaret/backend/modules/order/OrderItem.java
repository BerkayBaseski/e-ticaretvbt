package com.eticaret.backend.modules.order;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    private String productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}
