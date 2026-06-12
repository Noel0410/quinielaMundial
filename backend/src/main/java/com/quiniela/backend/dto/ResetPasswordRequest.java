package com.quiniela.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String newPassword;
}
