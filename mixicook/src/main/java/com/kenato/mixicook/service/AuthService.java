package com.kenato.mixicook.service;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.entity.User;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
    UserResponse getCurrentUser();
    UserResponse updateProfile(UpdateProfileRequest updateProfileRequest);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
