package pl.rafaldobkowski.sneakerlab.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Long id) {
        super("Nie znaleziono produktu o id: " + id);
    }
}