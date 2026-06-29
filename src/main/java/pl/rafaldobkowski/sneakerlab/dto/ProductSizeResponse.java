package pl.rafaldobkowski.sneakerlab.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductSizeResponse {

    private Long id;
    private Integer sizeNumber;
    private Integer stockQuantity;
}