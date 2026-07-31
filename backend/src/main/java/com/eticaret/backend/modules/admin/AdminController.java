package com.eticaret.backend.modules.admin;

import com.eticaret.backend.modules.order.Order;
import com.eticaret.backend.modules.order.OrderRepository;
import com.eticaret.backend.modules.product.ProductRepository;
import com.eticaret.backend.modules.category.CategoryRepository;
import com.eticaret.backend.modules.user.UserRepository;
import com.eticaret.backend.modules.review.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalCategories = categoryRepository.count();
        long totalReviews = reviewRepository.count();

        List<Order> allOrders = orderRepository.findAll();
        double totalRevenue = allOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long pendingOrders = allOrders.stream()
                .filter(o -> "pending".equalsIgnoreCase(o.getStatus()))
                .count();

        long processingOrders = allOrders.stream()
                .filter(o -> "processing".equalsIgnoreCase(o.getStatus()))
                .count();

        long deliveredOrders = allOrders.stream()
                .filter(o -> "delivered".equalsIgnoreCase(o.getStatus()))
                .count();

        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalCategories", totalCategories);
        stats.put("totalReviews", totalReviews);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingOrders", pendingOrders);
        stats.put("processingOrders", processingOrders);
        stats.put("deliveredOrders", deliveredOrders);

        return stats;
    }

    @GetMapping("/recent-orders")
    public List<Order> getRecentOrders() {
        List<Order> allOrders = orderRepository.findAll();
        return allOrders.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .toList();
    }
}
