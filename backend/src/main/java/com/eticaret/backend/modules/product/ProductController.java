package com.eticaret.backend.modules.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ProductsResponseDto getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "featured") String sort
    ) {
        return productService.getProducts(page, size, category, q, brand, minPrice, maxPrice, sort);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        productService.incrementViewCount(id);
        return productService.getProductByIdOrSlug(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    @GetMapping("/bestsellers")
    public List<Product> getBestsellers() {
        return productService.getBestsellers();
    }

    @GetMapping("/new-arrivals")
    public List<Product> getNewArrivals() {
        return productService.getNewArrivals();
    }

    @GetMapping("/most-viewed")
    public List<Product> getMostViewed() {
        return productService.getMostViewed();
    }

    @GetMapping("/{id}/related")
    public List<Product> getRelatedProducts(@PathVariable String id) {
        return productService.getRelatedProducts(id);
    }

    @GetMapping("/brands")
    public List<String> getAllBrands() {
        return productService.getAllBrands();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product productDetails) {
        return productService.getProductByIdOrSlug(id)
                .map(existing -> {
                    productDetails.setId(existing.getId());
                    return ResponseEntity.ok(productService.saveProduct(productDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}