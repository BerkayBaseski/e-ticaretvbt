package com.eticaret.backend.modules.order;

import com.eticaret.backend.modules.auth.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) auth.getPrincipal()).getId();
        }
        return "user-101"; // Fallback for testing without token
    }

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getOrdersByUserId(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderService.getOrderByIdOrOrderNumber(id)
                .filter(order -> order.getUserId().equals(getCurrentUserId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody(required = false) Map<String, Object> payload) {
        try {
            ShippingAddress shippingAddress = null;
            PaymentDetails paymentDetails = null;

            if (payload != null) {
                if (payload.containsKey("shippingAddress")) {
                    Map<String, String> addrMap = (Map<String, String>) payload.get("shippingAddress");
                    shippingAddress = ShippingAddress.builder()
                            .fullName(addrMap.get("fullName"))
                            .addressLine1(addrMap.get("addressLine1"))
                            .addressLine2(addrMap.get("addressLine2"))
                            .city(addrMap.get("city"))
                            .state(addrMap.get("state"))
                            .zipCode(addrMap.get("zipCode"))
                            .country(addrMap.get("country"))
                            .phone(addrMap.get("phone"))
                            .build();
                }

                if (payload.containsKey("paymentDetails")) {
                    Map<String, String> payMap = (Map<String, String>) payload.get("paymentDetails");
                    paymentDetails = PaymentDetails.builder()
                            .method(payMap.get("method"))
                            .cardLastFour(payMap.get("cardLastFour"))
                            .cardHolderName(payMap.get("cardHolderName"))
                            .build();
                }
            }

            Order newOrder = orderService.createOrder(getCurrentUserId(), shippingAddress, paymentDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "type", "https://api.eticaret.example.com/errors/empty-cart",
                    "title", "Boş Sepet Hatası",
                    "status", 400,
                    "detail", e.getMessage()
            ));
        }
    }
}