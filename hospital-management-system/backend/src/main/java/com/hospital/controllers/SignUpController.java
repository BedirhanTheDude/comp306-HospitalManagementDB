package com.hospital.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.SignUpRequest;
import com.hospital.repositories.PatientRepository;
import com.hospital.repositories.UserRepository;

@RestController
@RequestMapping("/api")
public class SignUpController {

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody SignUpRequest signUpRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (validateNewPatient(signUpRequest)) {
                String ssn = signUpRequest.getIdentityNumber();
                String fullName = signUpRequest.getFullName();
                String gender = signUpRequest.getGender();
                String phone = signUpRequest.getPhoneNumber();
                String dob = signUpRequest.getDateOfBirth();
                String password = signUpRequest.getPassword();

                savePatientData(ssn, fullName, gender, phone, dob, password);

                response.put("success", true);
                response.put("message", "Patient registered successfully");
                return ResponseEntity.ok(response);
            }

            response.put("success", false);
            response.put("error", "Invalid patient data");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
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
