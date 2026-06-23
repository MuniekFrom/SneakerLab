package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_EmailOrderByCreatedAtDesc(String email);
}
