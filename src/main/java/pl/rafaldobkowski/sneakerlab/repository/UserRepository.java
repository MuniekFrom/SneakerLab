package pl.rafaldobkowski.sneakerlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.rafaldobkowski.sneakerlab.model.AppUser;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);
}