package com.eticaret.backend.modules.user;

import com.eticaret.backend.modules.user.dto.UserCreateRequest;
import com.eticaret.backend.modules.user.dto.UserResponse;
import com.eticaret.backend.modules.user.dto.UserUpdateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceTests {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final UserService userService = new UserService(userRepository);

    @Test
    void shouldCreateUser() {
        UserCreateRequest request = new UserCreateRequest();
        request.setFirstName("Ayse");
        request.setLastName("Yilmaz");
        request.setEmail("ayse@example.com");
        request.setPassword("password123");
        request.setPhoneNumber("5551112233");
        request.setAddress("Ankara");
        request.setRole(UserRole.USER);

        when(userRepository.existsByEmail("ayse@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.createUser(request);

        assertThat(response.getEmail()).isEqualTo("ayse@example.com");
        assertThat(response.getRole()).isEqualTo(UserRole.USER);
        assertThat(response.isEnabled()).isTrue();
    }

    @Test
    void shouldRejectDuplicateEmail() {
        UserCreateRequest request = new UserCreateRequest();
        request.setFirstName("A");
        request.setLastName("B");
        request.setEmail("dupe@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("dupe@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void shouldUpdateUser() {
        User existingUser = new User("Old", "Name", "old@example.com", "encoded-password", null, null, UserRole.USER);
        existingUser.setId(1L);
        existingUser.setEnabled(true);

        UserUpdateRequest update = new UserUpdateRequest();
        update.setFirstName("New");
        update.setEnabled(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUser(1L, update);

        assertThat(response.getFirstName()).isEqualTo("New");
        assertThat(response.isEnabled()).isFalse();
    }
}