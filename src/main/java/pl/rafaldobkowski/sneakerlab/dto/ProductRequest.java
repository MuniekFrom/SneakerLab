package pl.rafaldobkowski.sneakerlab.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Nazwa produktu jest wymagana")
    private String name;

    @NotBlank(message = "Marka produktu jest wymagana")
    private String brand;

    @NotBlank(message = "Kategoria produktu jest wymagana")
    private String category;

    @NotNull(message = "Cena produktu jest wymagana")
    @Positive(message = "Cena musi być większa od 0")
    private BigDecimal price;

    private String description;

    private String imageUrl;

    @NotNull(message = "Ilość produktu jest wymagana")
    @PositiveOrZero(message = "Ilość nie może być ujemna")
    private Integer stockQuantity;

    private List<String> imageUrls;

    private List<Integer> availableSizes;
}