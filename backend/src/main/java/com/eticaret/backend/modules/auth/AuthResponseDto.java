package com.eticaret.backend.modules.auth;

import com.eticaret.backend.modules.user.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private User user;
}
