package com.codeforge.service;

import com.codeforge.dto.AuthResponse;
import com.codeforge.dto.LoginRequest;
import com.codeforge.dto.RegisterRequest;
import com.codeforge.exception.ResourceNotFoundException;
import com.codeforge.model.Leaderboard;
import com.codeforge.model.User;
import com.codeforge.repository.LeaderboardRepository;
import com.codeforge.repository.UserRepository;
import com.codeforge.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service layer for user authentication and registration.
 * Implements business rules — validates uniqueness, hashes passwords, generates JWT.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registers a new user with USER role.
     * Creates a leaderboard entry for the newly registered user.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        // Create user entity from DTO
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user = userRepository.save(user);

        // Initialize leaderboard entry for new user
        Leaderboard leaderboard = new Leaderboard();
        leaderboard.setUser(user);
        leaderboard.setTotalScore(0);
        leaderboard.setProblemsSolved(0);
        leaderboardRepository.save(leaderboard);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());

        return new AuthResponse(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    /**
     * Authenticates an existing user and returns a JWT.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());

        return new AuthResponse(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }
}
