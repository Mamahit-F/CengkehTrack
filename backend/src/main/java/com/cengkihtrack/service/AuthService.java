package com.cengkihtrack.service;

import com.cengkihtrack.dto.request.LoginRequest;
import com.cengkihtrack.dto.request.RegisterRequest;
import com.cengkihtrack.dto.request.UpdateProfileRequest;
import com.cengkihtrack.dto.response.AuthResponse;
import com.cengkihtrack.dto.response.UserResponse;
import com.cengkihtrack.entity.User;
import com.cengkihtrack.exception.BadRequestException;
import com.cengkihtrack.exception.ResourceNotFoundException;
import com.cengkihtrack.repository.UserRepository;
import com.cengkihtrack.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah terdaftar: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(User.Role.USER)
                .build();

        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail());
        return AuthResponse.of(token, UserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));

        return AuthResponse.of(token, UserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName());
        }
        if (StringUtils.hasText(request.getPhone())) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        // Ganti email jika berubah
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(email)) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email sudah digunakan");
            }
            user.setEmail(request.getEmail());
        }

        // Ganti password jika diminta
        if (StringUtils.hasText(request.getNewPassword())) {
            if (!StringUtils.hasText(request.getCurrentPassword())) {
                throw new BadRequestException("Password saat ini diperlukan untuk mengganti password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Password saat ini tidak sesuai");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);
        return UserResponse.from(user);
    }
}
