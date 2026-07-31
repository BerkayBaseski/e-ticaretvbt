package com.eticaret.backend.modules.review;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;

    @Column(nullable = false)
    private String productId;

    private String userId;
    private String userName;
    private String userAvatar;

    @Column(nullable = false)
    private Double rating;

    @Column(length = 2000)
    private String comment;

    @Builder.Default
    private Integer helpfulCount = 0;

    @Builder.Default
    private String createdAt = LocalDateTime.now().toString();
}