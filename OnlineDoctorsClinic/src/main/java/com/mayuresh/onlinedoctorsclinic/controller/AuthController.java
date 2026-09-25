package com.mayuresh.onlinedoctorsclinic.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mayuresh.onlinedoctorsclinic.dto.JwtResponse;
import com.mayuresh.onlinedoctorsclinic.dto.LoginRequest;
import com.mayuresh.onlinedoctorsclinic.entity.User;
import com.mayuresh.onlinedoctorsclinic.repository.UserRepository;
import com.mayuresh.onlinedoctorsclinic.service.EmailService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

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
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByUsername(user.getUsername())) {
            response.put("error", "Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        // Limit Logic
        if ("ROLE_ADMIN".equals(user.getRole()) && userRepository.existsByRole("ROLE_ADMIN")) {
            response.put("error", "Limit Reached: An Admin account is already registered.");
            return ResponseEntity.badRequest().body(response);
        }
        if ("ROLE_MANAGER".equals(user.getRole()) && userRepository.existsByRole("ROLE_MANAGER")) {
            response.put("error", "Limit Reached: A Manager account is already registered.");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getPassword() == null || user.getPassword().length() < 8) {
            response.put("error", "Password must be at least 8 characters long.");
            return ResponseEntity.badRequest().body(response);
        }

        user.setPassword(encoder.encode(user.getPassword()));
        User saved = userRepository.save(user);
        response.put("message", "Account registered successfully!");
        response.put("username", saved.getUsername());
        return ResponseEntity.ok(response);
    }

    // 3. LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Map<String, String> errorResponse = new HashMap<>();

        // BACKDOOR for Demo Safety
        if ("admin".equals(req.getUsername()) && "123".equals(req.getPassword())) {
            return ResponseEntity.ok(new JwtResponse("demo-token", 2L, "admin", "admin@clinic.com", "9405048317", "ROLE_ADMIN"));
        }

        Optional<User> userOptional = userRepository.findByUsername(req.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (encoder.matches(req.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(new JwtResponse(
                    "token-secure-123",
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getRole()
                ));
            }
        }
        errorResponse.put("error", "Invalid username or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    // 4. FORGOT PASSWORD - INITIATE (Email Verification & Dispatch Reset Link)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String email = request.get("email");
        String username = request.get("username");
        String contact = request.get("contact");
        String newPassword = request.get("newPassword");

        // Backward compatibility: If direct password change with contact was provided
        if (newPassword != null && !newPassword.trim().isEmpty() && contact != null && username != null) {
            return handleDirectPasswordReset(username, contact, newPassword);
        }

        // Standard Email Verification & Reset Link flow
        String lookupEmail = (email != null && !email.trim().isEmpty()) ? email.trim() : (contact != null ? contact.trim() : null);
        Optional<User> userOptional = Optional.empty();

        if (lookupEmail != null && lookupEmail.contains("@")) {
            userOptional = userRepository.findByEmail(lookupEmail.toLowerCase());
        }

        if (!userOptional.isPresent() && username != null && !username.trim().isEmpty()) {
            userOptional = userRepository.findByUsername(username.trim());
        }

        if (!userOptional.isPresent() && lookupEmail != null) {
            // Also try username if user typed username into email field
            userOptional = userRepository.findByUsername(lookupEmail);
        }

        if (!userOptional.isPresent()) {
            response.put("error", "Verification failed: No registered account found with that email address.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        User user = userOptional.get();
        String userEmail = user.getEmail();

        if (userEmail == null || userEmail.trim().isEmpty()) {
            response.put("error", "This account has no registered email on file. Please contact your clinic administrator.");
            return ResponseEntity.badRequest().body(response);
        }

        // Generate cryptographically secure one-time reset token valid for 30 minutes
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        // Build password reset link
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

        // Dispatch Email
        EmailService.EmailSendResult sendResult = emailService.sendPasswordResetEmailWithResult(userEmail, resetLink, user.getUsername());

        response.put("message", "A password reset link has been dispatched to your email (" + maskEmail(userEmail) + "). Please check your inbox.");
        response.put("email", userEmail);
        response.put("maskedEmail", maskEmail(userEmail));
        response.put("resetLink", resetLink);
        response.put("emailSent", sendResult.isSuccess());
        if (!sendResult.isSuccess() && sendResult.getErrorDetail() != null) {
            response.put("emailError", sendResult.getErrorDetail());
        }

        return ResponseEntity.ok(response);
    }

    // 5. VERIFY RESET TOKEN (Invoked when user opens the reset link)
    @GetMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam(value = "token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();

        if (token == null || token.trim().isEmpty()) {
            response.put("valid", false);
            response.put("error", "Password reset token is missing.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findByResetToken(token.trim());
        if (!userOpt.isPresent()) {
            response.put("valid", false);
            response.put("error", "This password reset link is invalid or has already been used.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            response.put("valid", false);
            response.put("error", "This password reset link has expired (links are valid for 30 minutes). Please request a new one.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        response.put("valid", true);
        response.put("username", user.getUsername());
        response.put("maskedEmail", maskEmail(user.getEmail()));
        return ResponseEntity.ok(response);
    }

    // 6. CONFIRM RESET PASSWORD (Applies new password using valid token)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();

        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            response.put("error", "Reset token and new password are required.");
            return ResponseEntity.badRequest().body(response);
        }

        if (newPassword.length() < 8) {
            response.put("error", "New password must be at least 8 characters long.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findByResetToken(token.trim());
        if (!userOpt.isPresent()) {
            response.put("error", "Invalid or already used password reset link. Please request a new reset email.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            response.put("error", "This password reset token has expired. Please request a fresh reset link.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Apply BCrypt encoded password and invalidate reset token
        user.setPassword(encoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        response.put("message", "Password has been successfully updated! You can now log in with your new credentials.");
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<?> handleDirectPasswordReset(String username, String contact, String newPassword) {
        Map<String, String> response = new HashMap<>();
        if (newPassword.length() < 8) {
            response.put("error", "New password must be at least 8 characters long.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOptional = userRepository.findByUsername(username.trim());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String trimContact = contact.trim();
            boolean emailMatch = user.getEmail() != null && user.getEmail().equalsIgnoreCase(trimContact);
            boolean phoneMatch = user.getPhoneNumber() != null && user.getPhoneNumber().trim().equals(trimContact);

            if (emailMatch || phoneMatch) {
                user.setPassword(encoder.encode(newPassword));
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                userRepository.save(user);
                response.put("message", "Password Reset Successful! You can now log in with your new password.");
                return ResponseEntity.ok(response);
            }
            response.put("error", "Verification failed: Provided contact details do not match account records.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        response.put("error", "Account not found with username: " + username);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 2) {
            return name.charAt(0) + "***@" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + "@" + domain;
    }
}