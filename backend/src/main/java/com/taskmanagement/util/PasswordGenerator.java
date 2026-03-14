package com.taskmanagement.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hash for Admin@123
        String adminPassword = "Admin@123";
        String adminHash = encoder.encode(adminPassword);
        System.out.println("Password: " + adminPassword);
        System.out.println("BCrypt Hash: " + adminHash);
        System.out.println();
        
        // Generate hash for User@123
        String userPassword = "User@123";
        String userHash = encoder.encode(userPassword);
        System.out.println("Password: " + userPassword);
        System.out.println("BCrypt Hash: " + userHash);
        System.out.println();
        
        // Generate hash for custom password
        String customPassword = "your-password-here";
        String customHash = encoder.encode(customPassword);
        System.out.println("Password: " + customPassword);
        System.out.println("BCrypt Hash: " + customHash);
        System.out.println();
        
        // Verify the hashes work
        System.out.println("Verification:");
        System.out.println("Admin@123 matches: " + encoder.matches("Admin@123", adminHash));
        System.out.println("User@123 matches: " + encoder.matches("User@123", userHash));
        System.out.println("Custom password matches: " + encoder.matches("your-password-here", customHash));
    }
}