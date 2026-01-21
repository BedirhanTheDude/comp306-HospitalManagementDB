package com.hospital.dto;

public class LoginRequest {

    // New field (dev): username
    private String username;

    // Backward compatible field (old): fullName
    private String fullName;

    private String password;

    private String role;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Prefer username if present, otherwise fall back to fullName
    public String getUsername() {
        if (username != null && !username.isBlank()) return username;
        return fullName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Keep old getters/setters so your older code still compiles
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // role: optional (some branches may not send it)
    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }
}
