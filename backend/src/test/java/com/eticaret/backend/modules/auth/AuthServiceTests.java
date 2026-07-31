package com.eticaret.backend.modules.auth;

import com.eticaret.backend.common.security.jwt.JwtService;
import com.eticaret.backend.modules.auth.dto.LoginRequest;
import com.eticaret.backend.modules.auth.dto.LoginResponse;
import com.eticaret.backend.modules.auth.dto.RefreshTokenRequest;
import com.eticaret.backend.modules.auth.dto.RegisterRequest;
import com.eticaret.backend.modules.user.User;
import com.eticaret.backend.modules.user.UserRepository;
import com.eticaret.backend.modules.user.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTests {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

    @Test
    void shouldRegisterUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Ayse");
        request.setLastName("Yilmaz");
        request.setEmail("ayse@example.com");
        request.setPassword("password123");

        User savedUser = new User("Ayse", "Yilmaz", "ayse@example.com", "encoded-password", null, null, UserRole.USER);
        savedUser.setId(1L);

        when(userRepository.existsByEmail("ayse@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateAccessToken(savedUser)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(savedUser)).thenReturn("refresh-token");

        LoginResponse response = authService.register(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getUser().getEmail()).isEqualTo("ayse@example.com");
    }

    @Test
    void shouldLoginWithCorrectCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ayse@example.com");
        request.setPassword("password123");

        User user = new User("Ayse", "Yilmaz", "ayse@example.com", "encoded-password", null, null, UserRole.USER);
        user.setId(1L);

        when(userRepository.findByEmail("ayse@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh-token");

        LoginResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getUser().getId()).isEqualTo(1L);
    }

    @Test
    void shouldRejectInvalidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ayse@example.com");
        request.setPassword("wrong-password");

        User user = new User("Ayse", "Yilmaz", "ayse@example.com", "encoded-password", null, null, UserRole.USER);

        when(userRepository.findByEmail("ayse@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED));
    }

    @Test
    void shouldRefreshTokens() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("refresh-token");

        User user = new User("Ayse", "Yilmaz", "ayse@example.com", "encoded-password", null, null, UserRole.USER);
        user.setId(1L);

        when(jwtService.extractUsername("refresh-token")).thenReturn("ayse@example.com");
        when(userRepository.findByEmail("ayse@example.com")).thenReturn(Optional.of(user));
        when(jwtService.isRefreshTokenValid("refresh-token", "ayse@example.com")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("new-access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("new-refresh-token");

        LoginResponse response = authService.refresh(request);

        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
        assertThat(response.getRefreshToken()).isEqualTo("new-refresh-token");
    }
}