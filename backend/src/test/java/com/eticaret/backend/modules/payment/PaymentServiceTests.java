package com.eticaret.backend.modules.payment;

import com.eticaret.backend.modules.payment.dto.PaymentCreateRequest;
import com.eticaret.backend.modules.payment.dto.PaymentResponse;
import com.eticaret.backend.modules.payment.dto.PaymentUpdateStatusRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PaymentServiceTests {

    private final PaymentRepository paymentRepository = mock(PaymentRepository.class);
    private final PaymentService paymentService = new PaymentService(paymentRepository);

    @Test
    void shouldCreatePayment() {
        PaymentCreateRequest request = new PaymentCreateRequest();
        request.setCustomerName("Ali Veli");
        request.setCustomerEmail("ali@example.com");
        request.setAmount(new BigDecimal("250.00"));
        request.setCurrency("TRY");
        request.setPaymentMethod("CARD");
        request.setTransactionId("trx-1");

        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.createPayment(request);

        assertThat(response.getCustomerEmail()).isEqualTo("ali@example.com");
        assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void shouldListPayments() {
        Payment payment = new Payment("Ali Veli", "ali@example.com", new BigDecimal("250.00"), "TRY", "CARD", "trx-1", PaymentStatus.COMPLETED);
        when(paymentRepository.findAll()).thenReturn(List.of(payment));

        assertThat(paymentService.getAllPayments()).hasSize(1);
    }

    @Test
    void shouldUpdateStatus() {
        Payment payment = new Payment("Ali Veli", "ali@example.com", new BigDecimal("250.00"), "TRY", "CARD", "trx-1", PaymentStatus.PENDING);
        payment.setId(1L);

        PaymentUpdateStatusRequest request = new PaymentUpdateStatusRequest();
        request.setStatus(PaymentStatus.COMPLETED);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(paymentService.updatePaymentStatus(1L, request).getStatus()).isEqualTo(PaymentStatus.COMPLETED);
    }

    @Test
    void shouldThrowWhenPaymentNotFound() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.getPaymentById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }
}