package com.hospital.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.LoginRequest;
import com.hospital.repositories.DoctorLookupRepository;
import com.hospital.repositories.UserRepository;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final DoctorLookupRepository doctorLookupRepository;

    public LoginController(DoctorLookupRepository doctorLookupRepository) {
        this.doctorLookupRepository = doctorLookupRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (!validateUser(loginRequest)) {
                response.put("success", false);
                response.put("error", "Invalid login data");
                return ResponseEntity.badRequest().body(response);
            }

            boolean isAuthenticated = authenticateUser(
                    loginRequest.getFullName(),
                    loginRequest.getPassword()
            );

            if (!isAuthenticated) {
                response.put("success", false);
                response.put("error", "Invalid login credentials");
                return ResponseEntity.badRequest().body(response);
            }

            // Login başarılı
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("role", loginRequest.getRole());

            // Doctor ise doctorId döndür
            if ("DOCTOR".equalsIgnoreCase(loginRequest.getRole())) {
                Long doctorId = doctorLookupRepository.findDoctorIdByUsername(loginRequest.getFullName());

                if (doctorId == null) {
                    response.put("success", false);
                    response.put("error", "Doctor not found for given email/username");
                    return ResponseEntity.badRequest().body(response);
                }

                response.put("doctorId", doctorId);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private boolean validateUser(LoginRequest loginRequest) {
        if (loginRequest.getFullName() == null || loginRequest.getFullName().isEmpty()) {
            return false;
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return false;
        }
        if (loginRequest.getRole() == null || loginRequest.getRole().isEmpty()) {
            return false;
        }
        return true;
    }

    private boolean authenticateUser(String username, String password) {
        return UserRepository.authenticateUser(username, password);
    }
}
