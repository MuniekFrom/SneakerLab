package pl.rafaldobkowski.sneakerlab.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.rafaldobkowski.sneakerlab.model.AppUser;
import pl.rafaldobkowski.sneakerlab.model.Role;
import pl.rafaldobkowski.sneakerlab.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@sneakerlab.pl")) {
            AppUser admin = new AppUser();
            admin.setFullName("Administrator SneakerLab");
            admin.setEmail("admin@sneakerlab.pl");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);
        }
    }
}