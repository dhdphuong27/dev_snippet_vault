package com.dongphuong.dev_snippet_vault_service.service.impl;

import com.dongphuong.dev_snippet_vault_service.dto.*;
import com.dongphuong.dev_snippet_vault_service.entity.User;
import com.dongphuong.dev_snippet_vault_service.repository.UserRepository;
import com.dongphuong.dev_snippet_vault_service.security.JwtUtil;
import com.dongphuong.dev_snippet_vault_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtUtil.generateToken(request.getUsername());
        return AuthResponse.builder()
                .username(request.getUsername())
                .accessToken(token)
                .build();
    }

    @Override
    public UserDTO register(RegisterRequest request) {  // ✅ Changed return type
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);  // ✅ Capture the saved user

        // ✅ Convert to DTO and return
        return UserDTO.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
}