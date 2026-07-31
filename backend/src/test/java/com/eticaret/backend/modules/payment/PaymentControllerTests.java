package com.eticaret.backend.modules.payment;

import com.eticaret.backend.modules.payment.dto.PaymentResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PaymentControllerTests {

    private final PaymentService paymentService = mock(PaymentService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PaymentController(paymentService)).build();

    @Test
    void shouldListPayments() throws Exception {
        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        response.setAmount(new BigDecimal("250.00"));
        when(paymentService.getAllPayments()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/payments"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldCreatePayment() throws Exception {
        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        when(paymentService.createPayment(any())).thenReturn(response);

        mockMvc.perform(post("/api/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "customerName": "Ali Veli",
                                  "customerEmail": "ali@example.com",
                                  "amount": 250.00,
                                  "currency": "TRY",
                                  "paymentMethod": "CARD",
                                  "transactionId": "trx-1"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldUpdatePaymentStatus() throws Exception {
        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        when(paymentService.updatePaymentStatus(any(), any())).thenReturn(response);

        mockMvc.perform(put("/api/payments/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"COMPLETED"}
                                """))
                .andExpect(status().isOk());
    }
}