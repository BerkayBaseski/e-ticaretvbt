package com.eticaret.backend.modules.coupon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByIsActiveTrueOrderByDiscountValueDesc();
    }

    public CouponValidationResult validateCoupon(String code, Double orderAmount) {
        Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(code);

        if (couponOpt.isEmpty()) {
            return CouponValidationResult.builder()
                    .valid(false)
                    .message("Geçersiz kupon kodu.")
                    .build();
        }

        Coupon coupon = couponOpt.get();

        if (!coupon.getIsActive()) {
            return CouponValidationResult.builder()
                    .valid(false)
                    .message("Bu kupon artık aktif değil.")
                    .build();
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            return CouponValidationResult.builder()
                    .valid(false)
                    .message("Bu kupon henüz kullanıma açılmadı.")
                    .build();
        }

        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            return CouponValidationResult.builder()
                    .valid(false)
                    .message("Bu kuponun geçerlilik süresi dolmuş.")
                    .build();
        }

        if (coupon.getUsedCount() >= coupon.getMaxUsageCount()) {
            return CouponValidationResult.builder()
                    .valid(false)
                    .message("Bu kuponun kullanım limiti dolmuştur.")
                    .build();
        }

        if (orderAmount < coupon.getMinOrderAmount()) {
            return CouponValidationResult.builder()
                    .valid(false)
                    .message(String.format("Bu kupon minimum %.0f TL'lik siparişlerde geçerlidir.", coupon.getMinOrderAmount()))
                    .build();
        }

        double discount = 0;
        switch (coupon.getDiscountType()) {
            case PERCENTAGE:
                discount = orderAmount * (coupon.getDiscountValue() / 100.0);
                if (coupon.getMaxDiscountAmount() != null) {
                    discount = Math.min(discount, coupon.getMaxDiscountAmount());
                }
                break;
            case FIXED:
                discount = coupon.getDiscountValue();
                break;
            case FREE_SHIPPING:
                discount = 49.0; // Standard shipping fee
                break;
        }

        return CouponValidationResult.builder()
                .valid(true)
                .message("Kupon başarıyla uygulandı!")
                .discountAmount(discount)
                .couponCode(coupon.getCode())
                .couponTitle(coupon.getTitle())
                .discountType(coupon.getDiscountType().name())
                .build();
    }

    public Coupon saveCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }
}
