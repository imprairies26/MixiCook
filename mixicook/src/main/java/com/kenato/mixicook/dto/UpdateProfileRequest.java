package com.kenato.mixicook.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String email;
    private String avatarUrl;
}
