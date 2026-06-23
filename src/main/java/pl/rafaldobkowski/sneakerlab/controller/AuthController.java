package pl.rafaldobkowski.sneakerlab.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.rafaldobkowski.sneakerlab.dto.AuthResponse;
import pl.rafaldobkowski.sneakerlab.dto.LoginRequest;
import pl.rafaldobkowski.sneakerlab.dto.RegisterRequest;
import pl.rafaldobkowski.sneakerlab.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}