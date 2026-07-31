package com.eticaret.backend.modules.user;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserEntityTests {

    @Test
    void shouldInitializeDefaultRoleAndTimestamps() {
        User user = new User("Ali", "Veli", "ali@example.com", "encoded-password", "5550000000", "Istanbul", null);

        user.onCreate();

        assertThat(user.getRole()).isEqualTo(UserRole.USER);
        assertThat(user.getCreatedAt()).isNotNull();
        assertThat(user.getUpdatedAt()).isNotNull();
    }
}