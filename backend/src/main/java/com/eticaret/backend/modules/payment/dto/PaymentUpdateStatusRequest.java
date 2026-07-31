package com.eticaret.backend.modules.payment.dto;

import com.eticaret.backend.modules.payment.PaymentStatus;
import jakarta.validation.constraints.NotNull;

public class PaymentUpdateStatusRequest {

    @NotNull
    private PaymentStatus status;

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
}