package pl.rafaldobkowski.sneakerlab.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.rafaldobkowski.sneakerlab.dto.OrderItemRequest;
import pl.rafaldobkowski.sneakerlab.dto.OrderRequest;
import pl.rafaldobkowski.sneakerlab.exception.NotEnoughStockException;
import pl.rafaldobkowski.sneakerlab.exception.ProductNotFoundException;
import pl.rafaldobkowski.sneakerlab.model.AppUser;
import pl.rafaldobkowski.sneakerlab.model.Order;
import pl.rafaldobkowski.sneakerlab.model.OrderItem;
import pl.rafaldobkowski.sneakerlab.model.Product;
import pl.rafaldobkowski.sneakerlab.repository.OrderRepository;
import pl.rafaldobkowski.sneakerlab.repository.ProductRepository;
import pl.rafaldobkowski.sneakerlab.repository.UserRepository;
import pl.rafaldobkowski.sneakerlab.model.Status;
import pl.rafaldobkowski.sneakerlab.model.ProductSize;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getMyOrders(String userEmail) {
        return orderRepository.findByUser_EmailOrderByCreatedAtDesc(userEmail);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zamówienia o id: " + id));
    }

    @Transactional
    public Order createOrder(OrderRequest request, String userEmail) {
        Order order = new Order();

        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        order.setUser(user);

        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setPostalCode(request.getPostalCode());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException(itemRequest.getProductId()));

            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new RuntimeException("Ilość produktu musi być większa od 0");
            }

            if (itemRequest.getSelectedSize() == null) {
                throw new RuntimeException("Musisz wybrać rozmiar produktu: " + product.getName());
            }

            boolean sizeExists = product.getSizes() == null
                    || product.getSizes().isEmpty()
                    || product.getSizes()
                    .stream()
                    .anyMatch(size -> size.getSizeNumber().equals(itemRequest.getSelectedSize()));

            if (!sizeExists) {
                throw new RuntimeException("Wybrany rozmiar nie jest dostępny dla produktu: " + product.getName());
            }

            ProductSize selectedProductSize = product.getSizes()
                    .stream()
                    .filter(size -> size.getSizeNumber().equals(itemRequest.getSelectedSize()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Wybrany rozmiar nie istnieje dla produktu: " + product.getName()));

            if (selectedProductSize.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException(
                        "Brak wystarczającej ilości produktu "
                                + product.getName()
                                + " w rozmiarze "
                                + itemRequest.getSelectedSize()
                );
            }

            selectedProductSize.setStockQuantity(
                    selectedProductSize.getStockQuantity() - itemRequest.getQuantity()
            );

            int totalStock = product.getSizes()
                    .stream()
                    .mapToInt(ProductSize::getStockQuantity)
                    .sum();

            product.setStockQuantity(totalStock);

            BigDecimal itemTotalPrice = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            totalPrice = totalPrice.add(itemTotalPrice);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setSelectedSize(itemRequest.getSelectedSize());
            orderItem.setPriceAtPurchase(product.getPrice());

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zamówienia o id: " + orderId));

        order.setStatus(status);

        return orderRepository.save(order);
    }

}