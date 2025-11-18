package com.dongphuong.dev_snippet_vault_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String username;
    private String accessToken;
}
