package com.eticaret.backend.modules.category;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 1000)
    private String description;

    private String icon;
    private String image;
    private String parentId;

    @Builder.Default
    private int itemCount = 0;

    @Builder.Default
    private int sortOrder = 0;
}
