package com.kenato.mixicook.service.impl;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.entity.User;
import com.kenato.mixicook.exception.CustomException;
import com.kenato.mixicook.repository.UserRepository;
import com.kenato.mixicook.security.JwtTokenProvider;
import com.kenato.mixicook.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).get();

        return AuthResponse.builder()
                .accessToken(jwt)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new CustomException("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new CustomException("Email is already in use!", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        userRepository.save(user);

        return login(new LoginRequest() {{
            setUsername(registerRequest.getUsername());
            setPassword(registerRequest.getPassword());
        }});
    }

    @Override
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest updateProfileRequest) {
        User user = getCurrentUserEntity();

        if (updateProfileRequest.getEmail() != null && !updateProfileRequest.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateProfileRequest.getEmail())) {
                throw new CustomException("Email is already in use!", HttpStatus.BAD_REQUEST);
            }
            user.setEmail(updateProfileRequest.getEmail());
        }

        if (updateProfileRequest.getAvatarUrl() != null) {
            user.setAvatarUrl(updateProfileRequest.getAvatarUrl());
        }

        userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Email không tồn tại trong hệ thống", HttpStatus.NOT_FOUND));
        
        // Mock: Gửi OTP qua email (thực tế sẽ lưu vào Redis/DB và dùng JavaMailSender)
        System.out.println("Gửi mã OTP khôi phục mật khẩu tới email: " + request.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Email không tồn tại", HttpStatus.NOT_FOUND));

        // Mock OTP validation (giả sử mã OTP là 123456)
        if (!"123456".equals(request.getOtp())) {
            throw new CustomException("Mã OTP không hợp lệ", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("Chưa đăng nhập", HttpStatus.UNAUTHORIZED);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("User không tồn tại", HttpStatus.NOT_FOUND));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
