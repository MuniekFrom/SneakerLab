package pl.rafaldobkowski.sneakerlab.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.rafaldobkowski.sneakerlab.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String brand;
    private String category;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private Integer stockQuantity;
    private LocalDateTime createdAt;

    public static ProductResponse fromProduct(Product product) {
        String mainImageUrl = product.getImageUrl();

        if ((mainImageUrl == null || mainImageUrl.isBlank())
                && product.getImages() != null
                && !product.getImages().isEmpty()) {
            mainImageUrl = product.getImages().get(0).getImageUrl();
        }

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getCategory(),
                product.getPrice(),
                product.getDescription(),
                mainImageUrl,
                product.getStockQuantity(),
                product.getCreatedAt()
        );
    }
}