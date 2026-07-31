package com.eticaret.backend.modules.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/products/{productId}/reviews")
    public List<Review> getReviewsByProduct(@PathVariable String productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable String productId, @RequestBody Map<String, Object> payload) {
        Double rating = payload.get("rating") != null ? ((Number) payload.get("rating")).doubleValue() : 5.0;
        String comment = (String) payload.get("comment");
        String userName = (String) payload.get("userName");

        Review review = reviewService.addReview(productId, "user-101", userName, rating, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }
}