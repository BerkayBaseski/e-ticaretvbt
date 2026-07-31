package com.eticaret.backend.modules.coupon;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    @Column(nullable = false)
    private Double discountValue;

    @Builder.Default
    private Double minOrderAmount = 0.0;

    private Double maxDiscountAmount;

    @Builder.Default
    private Integer maxUsageCount = 9999;

    @Builder.Default
    private Integer usedCount = 0;

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    @Builder.Default
    private Boolean isActive = true;

    private String applicableCategory;

    public enum DiscountType {
        PERCENTAGE,
        FIXED,
        FREE_SHIPPING
    }
}
