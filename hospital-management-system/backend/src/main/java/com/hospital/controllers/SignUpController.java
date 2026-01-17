package com.hospital.controllers;

import com.hospital.dto.SignUpRequest;
import com.hospital.repositories.PatientRepository;
import com.hospital.repositories.UserRepository;

public class SignUpController {

    public boolean signUp(SignUpRequest signUpRequest) {
        if (validateNewPatient(signUpRequest)) {
            String ssn = signUpRequest.getIdentityNumber();
            String fullName = signUpRequest.getFullName();
            String gender = signUpRequest.getGender();
            String phone = signUpRequest.getPhoneNumber();
            String dob = signUpRequest.getDateOfBirth();
            String password = signUpRequest.getPassword();

            savePatientData(ssn, fullName, gender, phone, dob, password);
            return true;
        }
        // Sign up logic
        return false;
    }

    private boolean validateNewPatient(SignUpRequest signUpRequest) {
        if (signUpRequest.getFullName() == null || signUpRequest.getFullName().isEmpty()) {
            return false;
        }
        if (signUpRequest.getGender() == null || signUpRequest.getGender().isEmpty()) {
            return false;
        }
        if (signUpRequest.getPhoneNumber() == null || signUpRequest.getPhoneNumber().isEmpty()) {
            return false;
        }
        if (signUpRequest.getDateOfBirth() == null || signUpRequest.getDateOfBirth().isEmpty()) {
            return false;
        }
        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().isEmpty()) {
            return false;
        }
        return true;
    }

    private void savePatientData(String identityNumber, String fullName, String gender, String phoneNumber, String dateOfBirth, String password) {
        PatientRepository.insertPatient(identityNumber, fullName, gender, phoneNumber, dateOfBirth);
        UserRepository.insertUser(fullName, password, "PATIENT");
    }
    
}
