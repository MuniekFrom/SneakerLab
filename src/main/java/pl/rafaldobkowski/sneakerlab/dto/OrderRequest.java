package pl.rafaldobkowski.sneakerlab.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {

    private String customerName;

    private String email;

    private String phone;

    private List<OrderItemRequest> items;
}