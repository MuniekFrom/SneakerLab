package pl.rafaldobkowski.sneakerlab.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.rafaldobkowski.sneakerlab.dto.OrderRequest;
import pl.rafaldobkowski.sneakerlab.model.Order;
import pl.rafaldobkowski.sneakerlab.service.OrderService;
import pl.rafaldobkowski.sneakerlab.dto.OrderStatusUpdateRequest;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(Authentication authentication) {
        return orderService.getMyOrders(authentication.getName());
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        return orderService.createOrder(request, authentication.getName());
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        return orderService.updateOrderStatus(id, request.getStatus());
    }
}