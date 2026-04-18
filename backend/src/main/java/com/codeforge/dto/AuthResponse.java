package com.codeforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for authentication responses.
 * Returns JWT token and user metadata after successful auth.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
}
