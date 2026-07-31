package com.eticaret.backend.exception;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RFC9457ErrorDto {
    private String type;
    private String title;
    private Integer status;
    private String detail;
    private String instance;
    private String timestamp;
}
