package pl.rafaldobkowski.sneakerlab.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.rafaldobkowski.sneakerlab.model.Product;
import pl.rafaldobkowski.sneakerlab.model.ProductSize;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {

    private Long id;
    private String name;
    private String brand;
    private String category;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private Integer stockQuantity;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
    private List<Integer> availableSizes;
    private List<ProductSizeResponse> sizes;

    public static ProductDetailResponse fromProduct(Product product) {
        List<String> imageUrls = new ArrayList<>();

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            imageUrls = product.getImages()
                    .stream()
                    .map(image -> image.getImageUrl())
                    .toList();
        } else if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            imageUrls.add(product.getImageUrl());
        }

        List<Integer> availableSizes = new ArrayList<>();
        List<ProductSizeResponse> sizes = new ArrayList<>();

        if (product.getSizes() != null) {
            availableSizes = product.getSizes()
                    .stream()
                    .sorted(Comparator.comparing(ProductSize::getSizeNumber))
                    .map(ProductSize::getSizeNumber)
                    .toList();

            sizes = product.getSizes()
                    .stream()
                    .sorted(Comparator.comparing(ProductSize::getSizeNumber))
                    .map(size -> new ProductSizeResponse(
                            size.getId(),
                            size.getSizeNumber(),
                            size.getStockQuantity()
                    ))
                    .toList();
        }

        String mainImageUrl = product.getImageUrl();

        if ((mainImageUrl == null || mainImageUrl.isBlank()) && !imageUrls.isEmpty()) {
            mainImageUrl = imageUrls.get(0);
        }

        return new ProductDetailResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getCategory(),
                product.getPrice(),
                product.getDescription(),
                mainImageUrl,
                product.getStockQuantity(),
                product.getCreatedAt(),
                imageUrls,
                availableSizes,
                sizes
        );
    }
}