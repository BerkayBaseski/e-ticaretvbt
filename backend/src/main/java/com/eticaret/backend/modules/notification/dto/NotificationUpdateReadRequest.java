package com.eticaret.backend.modules.notification.dto;

import jakarta.validation.constraints.NotNull;

public class NotificationUpdateReadRequest {

    @NotNull
    private Boolean read;

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }
}