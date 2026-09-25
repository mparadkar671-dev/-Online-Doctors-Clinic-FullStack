package com.mayuresh.onlinedoctorsclinic.dto;

public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;

    public JwtResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public JwtResponse(String token, Long id, String username, String email, String phoneNumber, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    // Getters
    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getRole() { return role; }
}