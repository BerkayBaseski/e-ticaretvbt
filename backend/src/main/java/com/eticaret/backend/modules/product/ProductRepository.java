package com.eticaret.backend.modules.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    Optional<Product> findBySlug(String slug);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(p.categoryId) = LOWER(:category) OR LOWER(p.categoryName) = LOWER(:category)) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:brand IS NULL OR :brand = '' OR LOWER(p.brand) = LOWER(:brand)) AND " +
           "(p.price >= :minPrice AND p.price <= :maxPrice)")
    Page<Product> filterProducts(
            @Param("category") String category,
            @Param("query") String query,
            @Param("brand") String brand,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );

    List<Product> findByIsFeaturedTrueOrderByRatingDesc();

    List<Product> findByIsBestsellerTrueOrderBySoldCountDesc();

    List<Product> findByIsNewTrueOrderByIdDesc();

    List<Product> findByCategoryIdAndIdNot(String categoryId, String productId);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL ORDER BY p.brand")
    List<String> findAllBrands();

    List<Product> findTop10ByOrderBySoldCountDesc();

    List<Product> findTop10ByOrderByViewCountDesc();
}