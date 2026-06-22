package pl.rafaldobkowski.sneakerlab.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.rafaldobkowski.sneakerlab.dto.ProductDetailResponse;
import pl.rafaldobkowski.sneakerlab.dto.ProductRequest;
import pl.rafaldobkowski.sneakerlab.dto.ProductResponse;
import pl.rafaldobkowski.sneakerlab.exception.ProductNotFoundException;
import pl.rafaldobkowski.sneakerlab.model.Product;
import pl.rafaldobkowski.sneakerlab.model.ProductImage;
import pl.rafaldobkowski.sneakerlab.model.ProductSize;
import pl.rafaldobkowski.sneakerlab.repository.ProductRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::fromProduct)
                .toList();
    }

    public ProductDetailResponse getProductById(Long id) {
        Product product = findProduct(id);
        return ProductDetailResponse.fromProduct(product);
    }

    @Transactional
    public ProductDetailResponse createProduct(ProductRequest request) {
        Product product = new Product();

        updateProductFields(product, request);
        updateProductImages(product, request);
        updateProductSizes(product, request);

        Product savedProduct = productRepository.save(product);

        return ProductDetailResponse.fromProduct(savedProduct);
    }

    @Transactional
    public ProductDetailResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProduct(id);

        updateProductFields(product, request);
        updateProductImages(product, request);
        updateProductSizes(product, request);

        Product savedProduct = productRepository.save(product);

        return ProductDetailResponse.fromProduct(savedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = findProduct(id);
        productRepository.delete(product);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private void updateProductFields(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(request.getStockQuantity());
    }

    private void updateProductImages(Product product, ProductRequest request) {
        product.getImages().clear();

        if (request.getImageUrls() == null || request.getImageUrls().isEmpty()) {
            return;
        }

        for (String imageUrl : request.getImageUrls()) {
            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }

            ProductImage productImage = new ProductImage();
            productImage.setImageUrl(imageUrl);
            productImage.setProduct(product);

            product.getImages().add(productImage);
        }

        if ((product.getImageUrl() == null || product.getImageUrl().isBlank())
                && !product.getImages().isEmpty()) {
            product.setImageUrl(product.getImages().get(0).getImageUrl());
        }
    }

    private void updateProductSizes(Product product, ProductRequest request) {
        product.getSizes().clear();

        if (request.getAvailableSizes() == null || request.getAvailableSizes().isEmpty()) {
            return;
        }

        for (Integer sizeNumber : request.getAvailableSizes()) {
            if (sizeNumber == null) {
                continue;
            }

            ProductSize productSize = new ProductSize();
            productSize.setSizeNumber(sizeNumber);
            productSize.setProduct(product);

            product.getSizes().add(productSize);
        }
    }
}