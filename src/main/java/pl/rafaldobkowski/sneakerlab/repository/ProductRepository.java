package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}