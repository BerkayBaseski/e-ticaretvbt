package com.eticaret.backend.modules.order;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetails {
    private String method;
    private String cardLastFour;
    private String cardHolderName;
}
