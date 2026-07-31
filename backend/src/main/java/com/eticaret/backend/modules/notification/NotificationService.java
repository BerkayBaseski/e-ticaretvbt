package com.eticaret.backend.modules.notification;

import com.eticaret.backend.modules.notification.dto.NotificationCreateRequest;
import com.eticaret.backend.modules.notification.dto.NotificationResponse;
import com.eticaret.backend.modules.notification.dto.NotificationUpdateReadRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificationResponse getNotificationById(Long id) {
        return toResponse(getNotificationEntityById(id));
    }

    public NotificationResponse createNotification(NotificationCreateRequest request) {
        Notification notification = new Notification();
        notification.setRecipientEmail(request.getRecipientEmail());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setRead(false);
        notification.setReadAt(null);

        return toResponse(notificationRepository.save(notification));
    }

    public NotificationResponse markAsRead(Long id, NotificationUpdateReadRequest request) {
        Notification notification = getNotificationEntityById(id);
        notification.setRead(Boolean.TRUE.equals(request.getRead()));
        notification.setReadAt(Boolean.TRUE.equals(request.getRead()) ? LocalDateTime.now() : null);

        return toResponse(notificationRepository.save(notification));
    }

    public void deleteNotification(Long id) {
        Notification notification = getNotificationEntityById(id);
        notificationRepository.delete(notification);
    }

    public Notification getNotificationEntityById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bildirim bulunamadı: " + id));
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setRecipientEmail(notification.getRecipientEmail());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setReadAt(notification.getReadAt());
        response.setCreatedAt(notification.getCreatedAt());
        response.setUpdatedAt(notification.getUpdatedAt());
        return response;
    }
}