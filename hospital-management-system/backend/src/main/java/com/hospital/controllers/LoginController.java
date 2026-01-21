package com.hospital.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        System.out.println("### LOGIN HIT body=" + body);

        Map<String, Object> response = new HashMap<>();

        // 1) username/fullName fallback
        String username = firstNonBlank(
                get(body, "username"),
                get(body, "userName"),
                get(body, "fullName"),
                get(body, "fullname"),
                get(body, "name")
        );

        // 2) password fallback
        String password = firstNonBlank(get(body, "password"), get(body, "pass"));

        // 3) role opsiyonel
        String role = get(body, "role");

        System.out.println("### PARSED username=" + username + " password=" + (password == null ? null : "***") + " role=" + role);

        // sadece gerçekten boşsa invalid data
        if (isBlank(username) || isBlank(password)) {
            response.put("success", false);
            response.put("error", "Invalid login data");
            return ResponseEntity.badRequest().body(response);
        }

        // auth
        boolean ok = UserRepository.authenticateUser(username, password);
        if (!ok) {
            response.put("success", false);
            response.put("error", "Invalid login credentials");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("success", true);
        response.put("message", "Login successful");

        // role gönderildiyse ekle
        if (!isBlank(role)) response.put("role", role);

        // doctorId: role DOCTOR ise ya da username doctor'a bağlıysa döndür
        Long doctorId = doctorLookupRepository.findDoctorIdByUsername(username);
        boolean roleSaysDoctor = "DOCTOR".equalsIgnoreCase(role);

        if (roleSaysDoctor || doctorId != null) {
            if (doctorId == null) {
                response.put("success", false);
                response.put("error", "Doctor not found for given username");
                return ResponseEntity.badRequest().body(response);
            }
            response.put("doctorId", doctorId);
            if (isBlank(role)) response.put("role", "DOCTOR");
        }

        return ResponseEntity.ok(response);
    }

    private static String get(Map<String, Object> body, String key) {
        Object v = body.get(key);
        return v == null ? null : String.valueOf(v);
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String firstNonBlank(String... vals) {
        for (String v : vals) {
            if (!isBlank(v)) return v;
        }
        return null;
    }
}
