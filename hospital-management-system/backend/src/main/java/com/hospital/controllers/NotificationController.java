package com.hospital.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.repositories.NotificationRepository;

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

            // Convert to notification format for frontend
            List<Map<String, Object>> notifications = new ArrayList<>();
            for (int i = 0; i < epidemics.size(); i++) {
                Map<String, Object> epidemic = epidemics.get(i);
                Map<String, Object> notification = new HashMap<>();
                notification.put("id", "epidemic_" + i);
                notification.put("text", "Warning: " + epidemic.get("diagnosis") + " cases detected (" + epidemic.get("count") + " cases this month)");
                notification.put("type", "epidemic");
                notifications.add(notification);
            }

            response.put("success", true);
            response.put("data", notifications);

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

        try {
            boolean isOverdue = NotificationRepository.getPatientIfBloodTestOverdue(patientssn);
            response.put("success", true);

            List<Map<String, Object>> notifications = new ArrayList<>();
            Map<String, Object> notification = new HashMap<>();
            notification.put("id", "blood_test_status");
            if (isOverdue) {
                notification.put("text", "You have not had a blood test in the last 6 months.");
                notification.put("type", "warning");
            } else {
                notification.put("text", "Your blood test records are up to date.");
                notification.put("type", "success");
            }
            notifications.add(notification);
            response.put("data", notifications);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/discounts")
    public ResponseEntity<Map<String, Object>> getDiscounts(
        @RequestParam int patientssn) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean hasDiscounts = NotificationRepository.checkDiscountEligibility(patientssn);
            response.put("success", true);

            List<Map<String, Object>> notifications = new ArrayList<>();
            Map<String, Object> notification = new HashMap<>();
            notification.put("id", "discount_status");
            if (hasDiscounts) {
                notification.put("text", "You are eligible for a 20% discount on tests.");
                notification.put("type", "info");
            } else {
                notification.put("text", "No discounts available at this time.");
                notification.put("type", "neutral");
            }
            notifications.add(notification);
            response.put("data", notifications);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

}
