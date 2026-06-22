package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.ProductSize;

public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {
}