package com.mayuresh.onlinedoctorsclinic.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mayuresh.onlinedoctorsclinic.dto.JwtResponse;
import com.mayuresh.onlinedoctorsclinic.dto.LoginRequest;
import com.mayuresh.onlinedoctorsclinic.entity.User;
import com.mayuresh.onlinedoctorsclinic.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    // 1. CHECK ROLE AVAILABILITY (Limits Admin/Manager to 1)
    @GetMapping("/roles-available")
    public ResponseEntity<?> getAvailableRoles() {
        Map<String, Boolean> availability = new HashMap<>();
        availability.put("ROLE_ADMIN", !userRepository.existsByRole("ROLE_ADMIN"));
        availability.put("ROLE_MANAGER", !userRepository.existsByRole("ROLE_MANAGER"));
        availability.put("ROLE_DOCTOR", true); 
        return ResponseEntity.ok(availability);
    }

    // 2. REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Limit Logic
        if ("ROLE_ADMIN".equals(user.getRole()) && userRepository.existsByRole("ROLE_ADMIN")) {
            return ResponseEntity.badRequest().body("Limit Reached: An Admin is already registered.");
        }
        if ("ROLE_MANAGER".equals(user.getRole()) && userRepository.existsByRole("ROLE_MANAGER")) {
            return ResponseEntity.badRequest().body("Limit Reached: A Manager is already registered.");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // 3. LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // BACKDOOR for Demo Safety
        if ("admin".equals(req.getUsername()) && "123".equals(req.getPassword())) {
            return ResponseEntity.ok(new JwtResponse("demo-token", "admin", "ROLE_ADMIN"));
        }

        Optional<User> userOptional = userRepository.findByUsername(req.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (encoder.matches(req.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(new JwtResponse("token-secure-123", user.getUsername(), user.getRole()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
    }

    // 4. FORGOT PASSWORD (Identity Verification)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String contact = request.get("contact"); 
        String newPassword = request.get("newPassword");

        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Verify if provided contact matches DB (Email or Phone)
            if (contact.equals(user.getEmail()) || contact.equals(user.getPhoneNumber())) {
                user.setPassword(encoder.encode(newPassword));
                userRepository.save(user);
                return ResponseEntity.ok("Password Reset Successful!");
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification failed: Incorrect contact info.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
}