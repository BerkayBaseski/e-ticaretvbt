package com.eticaret.backend.modules.notification;

import com.eticaret.backend.modules.notification.dto.NotificationResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationControllerTests {

    private final NotificationService notificationService = mock(NotificationService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new NotificationController(notificationService)).build();

    @Test
    void shouldListNotifications() throws Exception {
        NotificationResponse response = new NotificationResponse();
        response.setId(1L);
        when(notificationService.getAllNotifications()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldCreateNotification() throws Exception {
        NotificationResponse response = new NotificationResponse();
        response.setId(1L);
        when(notificationService.createNotification(any())).thenReturn(response);

        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "recipientEmail": "user@example.com",
                                  "title": "Test",
                                  "message": "Merhaba"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldMarkAsRead() throws Exception {
        NotificationResponse response = new NotificationResponse();
        response.setId(1L);
        when(notificationService.markAsRead(any(), any())).thenReturn(response);

        mockMvc.perform(put("/api/notifications/1/read")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"read":true}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldDeleteNotification() throws Exception {
        mockMvc.perform(delete("/api/notifications/1"))
                .andExpect(status().isOk());
    }
}