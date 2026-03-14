package com.taskmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.ApiResponse;
import com.taskmanagement.dto.AuthResponse;
import com.taskmanagement.dto.LoginRequest;
import com.taskmanagement.dto.RegisterRequest;
import com.taskmanagement.dto.UserDTO;
import com.taskmanagement.entity.User;
import com.taskmanagement.security.JwtUtils;
import com.taskmanagement.security.UserDetailsImpl;
import com.taskmanagement.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if passwords match
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error("Passwords do not match"));
        }
        
        User user = userService.registerUser(registerRequest);
        
        UserDTO userDTO = new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
        
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getId(), 
                userDetails.getUsername(), userDetails.getEmail(), role));
    }
}