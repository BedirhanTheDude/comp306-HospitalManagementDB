package com.hospital.controllers;

import com.hospital.dto.LoginRequest;
import com.hospital.repositories.DoctorLookupRepository;
import com.hospital.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final DoctorLookupRepository doctorLookupRepository;

    public LoginController(DoctorLookupRepository doctorLookupRepository) {
        this.doctorLookupRepository = doctorLookupRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {

        Map<String, Object> response = new HashMap<>();

        // ---- 1. Basic validation ----
        if (isBlank(req.getUsername()) ||
                isBlank(req.getPassword()) ||
                isBlank(req.getRole())) {

            response.put("success", false);
            response.put("error", "Invalid login data");
            return ResponseEntity.badRequest().body(response);
        }

        // ---- 2. Authentication ----
        boolean authenticated =
                UserRepository.authenticateUser(req.getUsername(), req.getPassword());

        if (!authenticated) {
            response.put("success", false);
            response.put("error", "Invalid login credentials");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("role", req.getRole().toUpperCase());

        // ---- 3. Role-specific payload ----
        switch (req.getRole().toUpperCase()) {

            case "PATIENT" -> {
                Map<String, Object> patient =
                        UserRepository.getPatientByUsername(req.getUsername());

                if (patient == null) {
                    response.put("success", false);
                    response.put("error", "Patient not found");
                    return ResponseEntity.badRequest().body(response);
                }

                response.put("ssn", patient.get("ssn"));
                response.put("fullName", patient.get("fullName"));
                response.put("gender", patient.get("gender"));
            }

            case "DOCTOR" -> {
                Long doctorId =
                        doctorLookupRepository.findDoctorIdByUsername(req.getUsername());

                if (doctorId == null) {
                    response.put("success", false);
                    response.put("error", "Doctor not found");
                    return ResponseEntity.badRequest().body(response);
                }

                response.put("doctorId", doctorId);
            }

            default -> {
                response.put("success", false);
                response.put("error", "Unsupported role");
                return ResponseEntity.badRequest().body(response);
            }
        }

        return ResponseEntity.ok(response);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
