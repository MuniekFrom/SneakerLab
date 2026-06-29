package pl.rafaldobkowski.sneakerlab.dto;

import lombok.Getter;
import lombok.Setter;
import pl.rafaldobkowski.sneakerlab.model.Status;

@Getter
@Setter
public class OrderStatusUpdateRequest {

    private Status status;
}