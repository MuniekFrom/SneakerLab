package pl.rafaldobkowski.sneakerlab.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.rafaldobkowski.sneakerlab.dto.AuthResponse;
import pl.rafaldobkowski.sneakerlab.dto.LoginRequest;
import pl.rafaldobkowski.sneakerlab.dto.RegisterRequest;
import pl.rafaldobkowski.sneakerlab.model.AppUser;
import pl.rafaldobkowski.sneakerlab.model.Role;
import pl.rafaldobkowski.sneakerlab.repository.UserRepository;
import pl.rafaldobkowski.sneakerlab.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Użytkownik z takim adresem e-mail już istnieje");
        }

        AppUser user = new AppUser();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);

        AppUser savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }
}