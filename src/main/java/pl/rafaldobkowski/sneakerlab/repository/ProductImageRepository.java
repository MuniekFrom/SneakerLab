package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}