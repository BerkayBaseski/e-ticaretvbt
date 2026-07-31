package com.eticaret.backend.modules.product;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductsResponseDto {
    private List<Product> content;
    private long totalElements;
    private int totalPages;
    private int page;
    private int size;
}
