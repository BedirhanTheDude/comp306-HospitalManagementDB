package com.hospital.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hospital.repositories.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    @GetMapping("/epidemics")
    public ResponseEntity<Map<String, Object>> getEpidemics(
            @RequestParam(defaultValue = "10") int threshold
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Map<String, Object>> epidemics = NotificationRepository.getEpidemicsLastMonth(threshold);
            if (epidemics == null) {
                epidemics = new ArrayList<>();
            }

            response.put("success", true);
            response.put("data", epidemics);

            // Ekstra: frontend uyarı metni için kolaylık
            response.put("message", epidemics.isEmpty()
                    ? "No epidemic signals in the last month."
                    : "Common diseases detected in the last month!");

            return ResponseEntity.ok(response);



        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> getTestOverdue(
        @RequestParam int patientssn){
        Map<String, Object> response = new HashMap<>();
        boolean isOverdue = NotificationRepository.getPatientIfBloodTestOverdue(patientssn);
        if(isOverdue){
            response.put("You have not had a blood test in the last 6 months.", true);
        }
        else{
            response.put(null, false);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/discounts")
    public ResponseEntity<Map<String, Object>> getDiscounts(
        @RequestParam int patientssn) {
        Map<String, Object> response = new HashMap<>();
        boolean hasDiscounts = NotificationRepository.checkDiscountEligibility(patientssn);

        try {
            if (hasDiscounts) {
                response.put("success", true);
                response.put("message", "There are patients eligible for discounts.");
            } else {
                response.put("success", true);
                response.put("message", "No patients eligible for discounts.");
            }
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

}
