package com.hospital.dto;

public class LoginRequest {
    // Login request data transfer object
    private String fullName;
    private String password;

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

    public LoginRequest() {
    }
    public LoginRequest(String fullName, String password) {
        this.fullName = fullName;
        this.password = password;
    }

}
