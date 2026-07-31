package com.eticaret.backend.modules.order;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id;

    private String userId;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Builder.Default
    private String status = "processing";

    @Embedded
    private ShippingAddress shippingAddress;

    @Embedded
    private PaymentDetails paymentDetails;

    private Double subtotal;
    private Double shippingFee;
    private Double discount;
    private Double totalAmount;

    @Builder.Default
    private String createdAt = LocalDateTime.now().toString();

    @Builder.Default
    private String updatedAt = LocalDateTime.now().toString();

    private String estimatedDelivery;
    private String trackingNumber;
}