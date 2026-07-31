package com.eticaret.backend.modules.coupon;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponValidationResult {

    private boolean valid;
    private String message;
    private Double discountAmount;
    private String couponCode;
    private String couponTitle;
    private String discountType;
}
