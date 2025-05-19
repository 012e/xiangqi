package com.se330.ctuong_backend.dto.rest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    @NotNull
    private Long id;
    @NotNull
    private String sub;
    @NotNull
    private String email;
    private String displayName;
    private String username;
    private String picture;
}
