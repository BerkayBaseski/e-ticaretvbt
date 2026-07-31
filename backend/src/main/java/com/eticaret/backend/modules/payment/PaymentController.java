package com.eticaret.backend.modules.payment;

import com.eticaret.backend.modules.payment.dto.PaymentCreateRequest;
import com.eticaret.backend.modules.payment.dto.PaymentResponse;
import com.eticaret.backend.modules.payment.dto.PaymentUpdateStatusRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public PaymentResponse getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    @PostMapping
    public PaymentResponse createPayment(@Valid @RequestBody PaymentCreateRequest request) {
        return paymentService.createPayment(request);
    }

    @PutMapping("/{id}/status")
    public PaymentResponse updatePaymentStatus(@PathVariable Long id, @Valid @RequestBody PaymentUpdateStatusRequest request) {
        return paymentService.updatePaymentStatus(id, request);
    }
}