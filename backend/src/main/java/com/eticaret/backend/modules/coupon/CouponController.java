package com.eticaret.backend.modules.coupon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/active")
    public List<Coupon> getActiveCoupons() {
        return couponService.getActiveCoupons();
    }

    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResult> validateCoupon(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        Double orderAmount = payload.get("orderAmount") != null
                ? ((Number) payload.get("orderAmount")).doubleValue()
                : 0.0;

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(
                    CouponValidationResult.builder()
                            .valid(false)
                            .message("Kupon kodu boş olamaz.")
                            .build()
            );
        }

        CouponValidationResult result = couponService.validateCoupon(code.trim(), orderAmount);
        return ResponseEntity.ok(result);
    }
}
