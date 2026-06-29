package pl.rafaldobkowski.sneakerlab.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.rafaldobkowski.sneakerlab.dto.UploadResponse;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UploadController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping("/product-image")
    public UploadResponse uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Nie wybrano pliku.");
        }

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Można przesyłać tylko pliki graficzne.");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null) {
            throw new RuntimeException("Nieprawidłowa nazwa pliku.");
        }

        String extension = "";

        int dotIndex = originalFilename.lastIndexOf(".");
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }

        String fileName = UUID.randomUUID() + extension;

        Path targetPath = uploadPath.resolve(fileName);

        file.transferTo(targetPath.toFile());

        String imageUrl = "/uploads/products/" + fileName;

        return new UploadResponse(imageUrl);
    }
}