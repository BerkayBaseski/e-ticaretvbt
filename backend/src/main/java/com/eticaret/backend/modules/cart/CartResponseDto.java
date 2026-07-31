package com.eticaret.backend.modules.cart;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDto {
    private List<CartItem> items;
    private Double subtotal;
    private Double shipping;
    private Double discount;
    private Double total;
    private Integer totalItems;
}
