package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
