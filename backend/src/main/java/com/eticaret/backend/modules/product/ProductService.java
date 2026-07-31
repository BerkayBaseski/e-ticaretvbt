package com.eticaret.backend.modules.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ProductsResponseDto getProducts(
            int page,
            int size,
            String category,
            String q,
            String brand,
            Double minPrice,
            Double maxPrice,
            String sort
    ) {
        Sort sorting = Sort.by(Sort.Direction.DESC, "isFeatured");
        if ("price_asc".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.DESC, "price");
        } else if ("rating".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("newest".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.DESC, "isNew");
        } else if ("bestseller".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.DESC, "soldCount");
        } else if ("most_reviewed".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.DESC, "reviewCount");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size, sorting);

        Double minP = (minPrice != null) ? minPrice : 0.0;
        Double maxP = (maxPrice != null) ? maxPrice : 9999999.0;

        Page<Product> productPage = productRepository.filterProducts(category, q, brand, minP, maxP, pageable);

        return ProductsResponseDto.builder()
                .content(productPage.getContent())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .page(page)
                .size(size)
                .build();
    }

    public Optional<Product> getProductByIdOrSlug(String idOrSlug) {
        Optional<Product> byId = productRepository.findById(idOrSlug);
        if (byId.isPresent()) return byId;
        return productRepository.findBySlug(idOrSlug);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueOrderByRatingDesc();
    }

    public List<Product> getBestsellers() {
        return productRepository.findTop10ByOrderBySoldCountDesc();
    }

    public List<Product> getNewArrivals() {
        return productRepository.findByIsNewTrueOrderByIdDesc();
    }

    public List<Product> getRelatedProducts(String productId) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) return List.of();
        return productRepository.findByCategoryIdAndIdNot(product.get().getCategoryId(), productId)
                .stream().limit(8).collect(Collectors.toList());
    }

    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }

    public List<Product> getMostViewed() {
        return productRepository.findTop10ByOrderByViewCountDesc();
    }

    public Product saveProduct(Product product) {
        if (product.getRating() != null) {
            product.setRating(Math.round(product.getRating() * 10.0) / 10.0);
        }
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public void incrementViewCount(String id) {
        productRepository.findById(id).ifPresent(product -> {
            product.setViewCount(product.getViewCount() + 1);
            productRepository.save(product);
        });
    }
}