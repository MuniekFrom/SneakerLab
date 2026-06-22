package pl.rafaldobkowski.sneakerlab.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.rafaldobkowski.sneakerlab.model.Order;
import pl.rafaldobkowski.sneakerlab.model.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private String customerName;
    private String email;
    private String phone;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private Status status;
    private Integer itemsCount;

    public static OrderResponse fromOrder(Order order) {
        int itemsCount = order.getItems() == null ? 0 : order.getItems().size();

        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getEmail(),
                order.getPhone(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getStatus(),
                itemsCount
        );
    }
}