package com.eticaret.backend.common.security.jwt;

import com.eticaret.backend.modules.user.User;
import com.eticaret.backend.modules.user.UserRole;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTests {

    @Test
    void shouldGenerateAndValidateTokens() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("3b7f7a9d0f31476f9e5c1b2a8f4c6d9e7a5b3c1d9f2e4a6b8c1d0e3f5a7b9c1");
        properties.setIssuer("e-ticaret-backend");
        properties.setAccessTokenExpirationMs(60_000);
        properties.setRefreshTokenExpirationMs(120_000);

        JwtService jwtService = new JwtService(properties);

        User user = new User("Ayse", "Yilmaz", "ayse@example.com", "encoded", null, null, UserRole.USER);
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        assertThat(jwtService.extractUsername(accessToken)).isEqualTo("ayse@example.com");
        assertThat(jwtService.isAccessTokenValid(accessToken, "ayse@example.com")).isTrue();
        assertThat(jwtService.isRefreshTokenValid(refreshToken, "ayse@example.com")).isTrue();
        assertThat(jwtService.extractTokenType(accessToken)).isEqualTo("access");
        assertThat(jwtService.extractTokenType(refreshToken)).isEqualTo("refresh");
    }
}