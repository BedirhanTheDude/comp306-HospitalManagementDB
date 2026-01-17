package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public static boolean insertUser(String username, String password, String userType) {
        String sql = "INSERT INTO USER(username, password_hash, user_type) VALUES (?, ?, ?)";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, passwordEncoder.encode(password)); // Hash password
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
        String sql = "SELECT password_hash FROM USER WHERE username = ?";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            var rs = ps.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password_hash");
                return passwordEncoder.matches(password, storedHash);
            }
            return false;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
