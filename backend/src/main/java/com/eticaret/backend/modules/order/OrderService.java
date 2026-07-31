package com.eticaret.backend.modules.order;

import com.eticaret.backend.modules.cart.CartItem;
import com.eticaret.backend.modules.cart.CartResponseDto;
import com.eticaret.backend.modules.cart.CartService;
import com.eticaret.backend.modules.user.User;
import com.eticaret.backend.modules.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Order> getOrderByIdOrOrderNumber(String idOrNumber) {
        Optional<Order> byId = orderRepository.findById(idOrNumber);
        if (byId.isPresent()) return byId;
        return orderRepository.findByOrderNumber(idOrNumber);
    }

    public Order createOrder(String userId, ShippingAddress shippingAddress, PaymentDetails paymentDetails) {
        CartResponseDto cart = cartService.getCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("Sepetinizde ürün bulunmamaktadır.");
        }

        User user = userService.findById(userId).orElse(null);

        String orderId = "ord-" + (1000 + new Random().nextInt(9000));
        String orderNumber = "TR-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000));

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(ci -> OrderItem.builder()
                        .productId(ci.getProductId())
                        .productName(ci.getProduct() != null ? ci.getProduct().getName() : "Ürün")
                        .productImage(ci.getProduct() != null && ci.getProduct().getImages() != null && !ci.getProduct().getImages().isEmpty()
                                ? ci.getProduct().getImages().get(0) : "")
                        .quantity(ci.getQuantity())
                        .unitPrice(ci.getUnitPrice())
                        .totalPrice(ci.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        ShippingAddress addr = shippingAddress != null ? shippingAddress : ShippingAddress.builder()
                .fullName(user != null ? user.getFirstName() + " " + user.getLastName() : "Ahmet Yılmaz")
                .addressLine1("Atatürk Cad. No: 42")
                .city("İstanbul")
                .state("Kadıköy")
                .zipCode("34710")
                .country("Türkiye")
                .phone(user != null && user.getPhone() != null ? user.getPhone() : "+90 555 123 45 67")
                .build();

        PaymentDetails pm = paymentDetails != null ? paymentDetails : PaymentDetails.builder()
                .method("credit_card")
                .cardLastFour("4242")
                .cardHolderName(addr.getFullName())
                .build();

        Order order = Order.builder()
                .id(orderId)
                .userId(userId)
                .orderNumber(orderNumber)
                .items(orderItems)
                .status("processing")
                .shippingAddress(addr)
                .paymentDetails(pm)
                .subtotal(cart.getSubtotal())
                .shippingFee(cart.getShipping())
                .discount(cart.getDiscount())
                .totalAmount(cart.getTotal())
                .createdAt(LocalDateTime.now().toString())
                .updatedAt(LocalDateTime.now().toString())
                .estimatedDelivery(LocalDate.now().plusDays(3).toString())
                .trackingNumber("TRK-" + (100000000 + new Random().nextInt(900000000)))
                .build();

        Order saved = orderRepository.save(order);

        // Empty cart
        cartService.clearCart(userId);

        return saved;
    }
}