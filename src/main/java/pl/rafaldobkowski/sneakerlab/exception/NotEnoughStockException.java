package pl.rafaldobkowski.sneakerlab.exception;

public class NotEnoughStockException extends RuntimeException {

    public NotEnoughStockException(String productName) {
        super("Brak wystarczającej liczby sztuk produktu: " + productName);
    }
}