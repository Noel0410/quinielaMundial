package com.quiniela.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
