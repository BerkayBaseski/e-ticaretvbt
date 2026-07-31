package com.eticaret.backend.modules.review;

import com.eticaret.backend.modules.product.Product;
import com.eticaret.backend.modules.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Review> getReviewsByProductId(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review addReview(String productId, String userId, String userName, Double rating, String comment) {
        Review review = Review.builder()
                .id("rev-" + UUID.randomUUID().toString().substring(0, 8))
                .productId(productId)
                .userId(userId != null ? userId : "user-101")
                .userName(userName != null ? userName : "Müşteri")
                .rating(rating != null ? rating : 5.0)
                .comment(comment)
                .createdAt(LocalDateTime.now().toString())
                .helpfulCount(0)
                .build();

        Review saved = reviewRepository.save(review);

        // Recalculate Product average rating and review count
        List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        productRepository.findById(productId).ifPresent(p -> {
            p.setReviewCount(allReviews.size());
            double avgRating = allReviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
            p.setRating(Math.round(avgRating * 10.0) / 10.0);
            productRepository.save(p);
        });

        return saved;
    }
}