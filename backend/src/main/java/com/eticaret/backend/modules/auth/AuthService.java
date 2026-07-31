package com.eticaret.backend.modules.auth;

import com.eticaret.backend.common.security.jwt.JwtService;
import com.eticaret.backend.modules.auth.dto.AuthUserResponse;
import com.eticaret.backend.modules.auth.dto.LoginRequest;
import com.eticaret.backend.modules.auth.dto.LoginResponse;
import com.eticaret.backend.modules.auth.dto.RefreshTokenRequest;
import com.eticaret.backend.modules.auth.dto.RegisterRequest;
import com.eticaret.backend.modules.user.User;
import com.eticaret.backend.modules.user.UserRepository;
import com.eticaret.backend.modules.user.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu e-posta adresi zaten kullanımda.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(UserRole.USER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        return buildLoginResponse(savedUser);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz kullanıcı bilgileri."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz kullanıcı bilgileri.");
        }

        return buildLoginResponse(user);
    }

    public LoginResponse refresh(RefreshTokenRequest request) {
        String email = jwtService.extractUsername(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz yenileme tokeni."));

        if (!jwtService.isRefreshTokenValid(request.getRefreshToken(), user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz yenileme tokeni.");
        }

        return buildLoginResponse(user);
    }

    public AuthUserResponse getCurrentUser(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Yetkilendirme gerekli.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı."));

        return toAuthUserResponse(user);
    }

    private LoginResponse buildLoginResponse(User user) {
        LoginResponse response = new LoginResponse();
        response.setAccessToken(jwtService.generateAccessToken(user));
        response.setRefreshToken(jwtService.generateRefreshToken(user));
        response.setExpiresIn(900000L);
        response.setUser(toAuthUserResponse(user));
        return response;
    }

    private AuthUserResponse toAuthUserResponse(User user) {
        AuthUserResponse response = new AuthUserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        return response;
    }
}