package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    
    public static boolean insertUser(String username, String password, String userType) {
        String sql = "INSERT INTO USER(username, password_hash, user_type) VALUES (?, ?, ?)";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, password);
            ps.setString(3, userType);

            int rowsInserted = ps.executeUpdate();
            
            if (rowsInserted > 0) {
                System.out.println("User inserted successfully! repository");
                return true;
            }
            return false;

        } catch (SQLException e) {
            System.out.println("Error inserting user: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    public static boolean authenticateUser(String username, String password) {
        // Case-insensitive username karşılaştırması
        String sql = "SELECT password_hash FROM USER WHERE LOWER(username) = LOWER(?)";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            var rs = ps.executeQuery();

            if (rs.next()) {
                String storedPassword = rs.getString("password_hash");
                return storedPassword.equals(password);
            }
            return false;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static Map<String, Object> getPatientByUsername(String username) {
        // PATIENT tablosundaki username kolonu ile eşleştir
        String sql = "SELECT ssn, fullname, gender FROM PATIENT WHERE username = ?";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                Map<String, Object> patient = new HashMap<>();
                patient.put("ssn", rs.getString("ssn"));
                patient.put("fullName", rs.getString("fullname"));
                patient.put("gender", rs.getString("gender"));
                System.out.println("Patient found: " + patient);
                return patient;
            }
            System.out.println("No patient found for username: " + username);
            return null;

        } catch (SQLException e) {
            System.out.println("Error fetching patient: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
