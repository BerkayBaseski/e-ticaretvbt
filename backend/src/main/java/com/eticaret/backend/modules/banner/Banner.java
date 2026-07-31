package com.eticaret.backend.modules.banner;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String imageUrl;

    private String linkUrl;

    private String buttonText;

    private String badgeText;

    private String gradientFrom;
    private String gradientTo;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BannerPosition position = BannerPosition.HERO;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer sortOrder = 0;

    public enum BannerPosition {
        HERO,
        SIDEBAR,
        CATEGORY,
        PROMOTION
    }
}
