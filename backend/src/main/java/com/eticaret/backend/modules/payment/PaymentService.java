package com.eticaret.backend.modules.payment;

import com.eticaret.backend.modules.payment.dto.PaymentCreateRequest;
import com.eticaret.backend.modules.payment.dto.PaymentResponse;
import com.eticaret.backend.modules.payment.dto.PaymentUpdateStatusRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public PaymentResponse getPaymentById(Long id) {
        return toResponse(getPaymentEntityById(id));
    }

    public PaymentResponse createPayment(PaymentCreateRequest request) {
        Payment payment = new Payment();
        payment.setCustomerName(request.getCustomerName());
        payment.setCustomerEmail(request.getCustomerEmail());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency() == null || request.getCurrency().isBlank() ? "TRY" : request.getCurrency());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(request.getTransactionId());
        payment.setStatus(PaymentStatus.PENDING);

        return toResponse(paymentRepository.save(payment));
    }

    public PaymentResponse updatePaymentStatus(Long id, PaymentUpdateStatusRequest request) {
        Payment payment = getPaymentEntityById(id);
        payment.setStatus(request.getStatus());

        return toResponse(paymentRepository.save(payment));
    }

    public Payment getPaymentEntityById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ödeme bulunamadı: " + id));
    }

    private PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setCustomerName(payment.getCustomerName());
        response.setCustomerEmail(payment.getCustomerEmail());
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setTransactionId(payment.getTransactionId());
        response.setStatus(payment.getStatus());
        response.setCreatedAt(payment.getCreatedAt());
        response.setUpdatedAt(payment.getUpdatedAt());
        return response;
    }
}