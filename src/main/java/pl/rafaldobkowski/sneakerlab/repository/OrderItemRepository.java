package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.OrderItem;


public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
