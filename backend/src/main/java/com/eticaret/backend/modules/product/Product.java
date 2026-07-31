package com.eticaret.backend.modules.product;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    @Builder.Default
    private String currency = "TRY";

    private String categoryId;
    private String categoryName;

    private String brand;
    private String sku;
    private Double weight;
    private String color;
    private String size;

    @Builder.Default
    private Integer discountPercent = 0;

    @Builder.Default
    private Integer soldCount = 0;

    @Builder.Default
    private Integer viewCount = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Integer stock = 10;

    @Builder.Default
    private Boolean isNew = false;

    @Builder.Default
    private Boolean isFeatured = false;

    @Builder.Default
    private Boolean isBestseller = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_specs", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "spec_key")
    @Column(name = "spec_value")
    @Builder.Default
    private Map<String, String> specs = new HashMap<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color_option")
    @Builder.Default
    private Set<String> colorOptions = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size_option")
    @Builder.Default
    private Set<String> sizeOptions = new HashSet<>();
}