package pl.rafaldobkowski.sneakerlab.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.rafaldobkowski.sneakerlab.dto.UpdateUserRequest;
import pl.rafaldobkowski.sneakerlab.dto.UserResponse;
import pl.rafaldobkowski.sneakerlab.model.AppUser;
import pl.rafaldobkowski.sneakerlab.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Transactional
    public UserResponse updateCurrentUser(String email, UpdateUserRequest request) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        user.setFullName(request.getFullName());

        AppUser savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }
}