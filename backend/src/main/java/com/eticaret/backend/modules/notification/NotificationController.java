package com.eticaret.backend.modules.notification;

import com.eticaret.backend.modules.notification.dto.NotificationCreateRequest;
import com.eticaret.backend.modules.notification.dto.NotificationResponse;
import com.eticaret.backend.modules.notification.dto.NotificationUpdateReadRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public NotificationResponse getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @PostMapping
    public NotificationResponse createNotification(@Valid @RequestBody NotificationCreateRequest request) {
        return notificationService.createNotification(request);
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id, @Valid @RequestBody NotificationUpdateReadRequest request) {
        return notificationService.markAsRead(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}