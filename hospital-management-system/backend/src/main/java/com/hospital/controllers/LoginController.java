package com.hospital.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.LoginRequest;
import com.hospital.repositories.UserRepository;

@RestController
@RequestMapping("/api")
public class LoginController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            if(validateUser(loginRequest)){
                boolean isAuthenticated = authenticateUser(loginRequest.getFullName(), loginRequest.getPassword());
                if (isAuthenticated) {
                    response.put("success", true);
                    response.put("message", "Login successful");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("error", "Invalid login credentials");
                    return ResponseEntity.badRequest().body(response);
                }
            }
            else {
                 response.put("success", false);
                 response.put("error", "Invalid login data");
                 return ResponseEntity.badRequest().body(response);
            }

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
        return true;
    }
    private boolean  authenticateUser(String fullName, String password) {
        return UserRepository.authenticateUser(fullName, password);
    }

   
    
}
