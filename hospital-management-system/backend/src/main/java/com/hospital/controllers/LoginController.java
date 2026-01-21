package com.hospital.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

            // Dev uyumu: username varsa onu kullan, yoksa fullName fallback
            String username = getUsername(loginRequest);

            boolean isAuthenticated = authenticateUser(username, loginRequest.getPassword());

            if (!isAuthenticated) {
                response.put("success", false);
                response.put("error", "Invalid login credentials");
                return ResponseEntity.badRequest().body(response);
            }

            // Login başarılı
            response.put("success", true);
            response.put("message", "Login successful");

            // role dev'de kaldırılmış olabilir -> null olabilir, yine de response'a koyuyoruz
            String role = safeTrim(loginRequest.getRole());
            if (role != null) {
                response.put("role", role);
            }

            // DoctorId mantığı:
            // 1) role DOCTOR ise doctorId dön
            // 2) role yoksa / farklıysa bile, username doctor ise doctorId dön (safe & merge-friendly)
            Long doctorId = doctorLookupRepository.findDoctorIdByUsername(username);

            boolean roleSaysDoctor = (role != null && "DOCTOR".equalsIgnoreCase(role));
            boolean userIsDoctor = (doctorId != null);

            if (roleSaysDoctor || userIsDoctor) {
                if (doctorId == null) {
                    response.put("success", false);
                    response.put("error", "Doctor not found for given username");
                    return ResponseEntity.badRequest().body(response);
                }
                response.put("doctorId", doctorId);

                // role hiç gelmediyse ama doctor bulunduysa role'u DOCTOR olarak setleyebiliriz (opsiyonel)
                if (role == null) {
                    response.put("role", "DOCTOR");
                }
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private boolean validateUser(LoginRequest loginRequest) {
        String username = getUsername(loginRequest);
        if (username == null || username.isEmpty()) return false;

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) return false;

        //  role artık zorunlu değil (dev ile uyum için)
        return true;
    }

    private String getUsername(LoginRequest loginRequest) {
        // LoginRequest'e getUsername() eklediysen onu kullan:
        try {
            String u = safeTrim(loginRequest.getUsername()); // fallback'li method ise süper
            if (u != null) return u;
        } catch (Exception ignored) {}

        // Eski yapı: fullName alanına username yazılıyor olabilir
        return safeTrim(loginRequest.getFullName());
    }

    private String safeTrim(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private boolean authenticateUser(String username, String password) {
        return UserRepository.authenticateUser(username, password);
    }
}
