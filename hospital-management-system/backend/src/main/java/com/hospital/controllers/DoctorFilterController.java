package com.hospital.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.repositories.HospitalBranchRepository;
import com.hospital.repositories.PoliclinicRepository;

@RestController
@RequestMapping("/api/doctor-filters")
public class DoctorFilterController {

    @GetMapping("/policlinics")
    public ResponseEntity<Map<String, Object>> getPoliclinics() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<String> policlinics = PoliclinicRepository.getAllPoliclinics();
            if (policlinics == null) {
                policlinics = new ArrayList<>();
            }
            response.put("success", true);
            response.put("data", policlinics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/cities")
    public ResponseEntity<Map<String, Object>> getCities() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<String> cities = HospitalBranchRepository.getAllCities();
            if (cities == null) {
                cities = new ArrayList<>();
            }
            response.put("success", true);
            response.put("data", cities);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
