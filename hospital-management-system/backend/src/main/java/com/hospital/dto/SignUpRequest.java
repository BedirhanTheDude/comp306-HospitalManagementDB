package com.hospital.dto;

public class SignUpRequest {
    // Sign up request data transfer object
    private String identityNumber;
    private String fullName;
    private String gender;
    private String phoneNumber;
    private String dateOfBirth;
    private String password;

    // Default constructor required for JSON deserialization
    public SignUpRequest() {
    }

    public SignUpRequest(String identityNumber, String fullName, String gender, String phoneNumber, String dateOfBirth, String password) {
        this.identityNumber = identityNumber;
        this.fullName = fullName;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.password = password;
    }
    public String getIdentityNumber() {
        return identityNumber;
    }
    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}