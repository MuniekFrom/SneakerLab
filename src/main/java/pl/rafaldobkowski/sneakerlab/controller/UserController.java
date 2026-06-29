package pl.rafaldobkowski.sneakerlab.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.rafaldobkowski.sneakerlab.dto.UpdateUserRequest;
import pl.rafaldobkowski.sneakerlab.dto.UserResponse;
import pl.rafaldobkowski.sneakerlab.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(
            @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {
        return userService.updateCurrentUser(authentication.getName(), request);
    }
}