package com.eticaret.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RFC9457ErrorDto> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        RFC9457ErrorDto error = RFC9457ErrorDto.builder()
                .type("https://api.eticaret.example.com/errors/bad-request")
                .title("Geçersiz İstek")
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(ex.getMessage())
                .instance(request.getRequestURI())
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<RFC9457ErrorDto> handleIllegalStateException(IllegalStateException ex, HttpServletRequest request) {
        RFC9457ErrorDto error = RFC9457ErrorDto.builder()
                .type("https://api.eticaret.example.com/errors/invalid-state")
                .title("İşlem Başarısız")
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(ex.getMessage())
                .instance(request.getRequestURI())
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RFC9457ErrorDto> handleGeneralException(Exception ex, HttpServletRequest request) {
        RFC9457ErrorDto error = RFC9457ErrorDto.builder()
                .type("https://api.eticaret.example.com/errors/internal-server-error")
                .title("Sunucu Hatası")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .detail(ex.getMessage() != null ? ex.getMessage() : "Sunucuda beklenmeyen bir hata oluştu.")
                .instance(request.getRequestURI())
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(error);
    }
}
