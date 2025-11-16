package com.dongphuong.dev_snippet_vault_service.service;

import com.dongphuong.dev_snippet_vault_service.dto.AuthRequest;
import com.dongphuong.dev_snippet_vault_service.dto.AuthResponse;
import com.dongphuong.dev_snippet_vault_service.dto.RegisterRequest;
import com.dongphuong.dev_snippet_vault_service.dto.UserDTO;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);
    UserDTO register(com.dongphuong.dev_snippet_vault_service.dto.RegisterRequest request);
}
