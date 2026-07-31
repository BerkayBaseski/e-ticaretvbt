package com.eticaret.backend.modules.notification;

import com.eticaret.backend.modules.notification.dto.NotificationCreateRequest;
import com.eticaret.backend.modules.notification.dto.NotificationResponse;
import com.eticaret.backend.modules.notification.dto.NotificationUpdateReadRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class NotificationServiceTests {

    private final NotificationRepository notificationRepository = mock(NotificationRepository.class);
    private final NotificationService notificationService = new NotificationService(notificationRepository);

    @Test
    void shouldCreateNotification() {
        NotificationCreateRequest request = new NotificationCreateRequest();
        request.setRecipientEmail("user@example.com");
        request.setTitle("Sipariş");
        request.setMessage("Siparişiniz oluşturuldu.");

        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.createNotification(request);

        assertThat(response.getRecipientEmail()).isEqualTo("user@example.com");
        assertThat(response.isRead()).isFalse();
    }

    @Test
    void shouldListNotifications() {
        Notification notification = new Notification("user@example.com", "Başlık", "Mesaj");
        when(notificationRepository.findAll()).thenReturn(List.of(notification));

        assertThat(notificationService.getAllNotifications()).hasSize(1);
    }

    @Test
    void shouldMarkAsRead() {
        Notification notification = new Notification("user@example.com", "Başlık", "Mesaj");
        notification.setId(1L);

        NotificationUpdateReadRequest request = new NotificationUpdateReadRequest();
        request.setRead(true);

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.markAsRead(1L, request);

        assertThat(response.isRead()).isTrue();
        assertThat(response.getReadAt()).isNotNull();
    }

    @Test
    void shouldThrowWhenNotificationNotFound() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.getNotificationById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }
}