package com.eticaret.backend.modules.notification.dto;

import jakarta.validation.constraints.NotBlank;

public class NotificationCreateRequest {

    @NotBlank
    private String recipientEmail;

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}