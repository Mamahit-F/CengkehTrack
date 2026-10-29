package com.cengkihtrack.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtTokenProvider - Unit Tests")
class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        // Secret minimal 256 bit (32 karakter)
        String secret = "cengkihtrack-super-secret-key-for-jwt-signing-must-be-at-least-256-bits-long";
        tokenProvider = new JwtTokenProvider(secret, 86400000L);
    }

    @Test
    @DisplayName("generateToken dan getEmailFromToken - roundtrip berhasil")
    void generateAndExtract_shouldRoundtrip() {
        String email = "petani@example.com";
        String token = tokenProvider.generateToken(email);

        assertThat(token).isNotBlank();
        assertThat(tokenProvider.getEmailFromToken(token)).isEqualTo(email);
    }

    @Test
    @DisplayName("validateToken - token valid mengembalikan true")
    void validateToken_validToken_returnsTrue() {
        String token = tokenProvider.generateToken("petani@example.com");
        assertThat(tokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("validateToken - token tidak valid mengembalikan false")
    void validateToken_invalidToken_returnsFalse() {
        assertThat(tokenProvider.validateToken("ini-bukan-token-valid")).isFalse();
    }

    @Test
    @DisplayName("validateToken - token kedaluwarsa mengembalikan false")
    void validateToken_expiredToken_returnsFalse() {
        // Token dengan expiry 1ms
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(
                "cengkihtrack-super-secret-key-for-jwt-signing-must-be-at-least-256-bits-long",
                1L
        );
        String token = shortLivedProvider.generateToken("petani@example.com");

        // Tunggu token kedaluwarsa
        try { Thread.sleep(10); } catch (InterruptedException ignored) {}

        assertThat(shortLivedProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("generateToken - menghasilkan token berbeda untuk email berbeda")
    void generateToken_differentEmails_differentTokens() {
        String token1 = tokenProvider.generateToken("petani1@example.com");
        String token2 = tokenProvider.generateToken("petani2@example.com");
        assertThat(token1).isNotEqualTo(token2);
    }
}
