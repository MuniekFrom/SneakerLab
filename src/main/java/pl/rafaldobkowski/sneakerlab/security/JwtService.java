package pl.rafaldobkowski.sneakerlab.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import pl.rafaldobkowski.sneakerlab.model.AppUser;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final String secretKey = "YmFyZHpvLWRsdWdpLXNla3JldC1kbGEtdG9rZW51LWp3dC1zbmVha2VybGFiLTIwMjY=";

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(AppUser user) {
        long expirationTime = 1000 * 60 * 60 * 24;

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}