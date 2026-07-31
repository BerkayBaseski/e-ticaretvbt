package com.eticaret.backend.modules.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}
