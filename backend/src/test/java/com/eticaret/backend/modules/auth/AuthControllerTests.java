package com.eticaret.backend.modules.auth;

import com.eticaret.backend.modules.auth.dto.AuthUserResponse;
import com.eticaret.backend.modules.auth.dto.LoginResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTests {

    private final AuthService authService = mock(AuthService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AuthController(authService)).build();

    @Test
    void shouldRegister() throws Exception {
        LoginResponse response = new LoginResponse();
        response.setAccessToken("access-token");
        response.setRefreshToken("refresh-token");
        when(authService.register(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Ayse",
                                  "lastName": "Yilmaz",
                                  "email": "ayse@example.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldLogin() throws Exception {
        LoginResponse response = new LoginResponse();
        response.setAccessToken("access-token");
        response.setRefreshToken("refresh-token");
        when(authService.login(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "ayse@example.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldExposeMeEndpoint() throws Exception {
        AuthUserResponse me = new AuthUserResponse();
        me.setEmail("ayse@example.com");
        when(authService.getCurrentUser("ayse@example.com")).thenReturn(me);

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}