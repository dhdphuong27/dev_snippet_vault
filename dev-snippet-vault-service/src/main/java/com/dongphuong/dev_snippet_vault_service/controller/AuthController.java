package com.dongphuong.dev_snippet_vault_service.controller;

import com.dongphuong.dev_snippet_vault_service.dto.*;
import com.dongphuong.dev_snippet_vault_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest request) {  // ✅ Changed return type
        UserDTO user = authService.register(request);  // ✅ Capture the returned user
        return ResponseEntity.status(HttpStatus.CREATED).body(user);  // ✅ Return it in body
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse resp = authService.authenticate(request);
        return ResponseEntity.ok(resp);
    }
}