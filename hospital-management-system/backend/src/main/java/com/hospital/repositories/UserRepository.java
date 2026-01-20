package com.hospital.repositories;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.hospital.dto.DoctorSearchRequest;
import com.hospital.dto.DoctorSearchResponse;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    
    public static boolean insertUser(String username, String password, String userType) {
        String sql = "INSERT INTO USER(username, password, user_type) VALUES (?, ?, ?)";

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
        String sql = "SELECT password FROM USER WHERE username = ?";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            var rs = ps.executeQuery();

            if (rs.next()) {
                String storedPassword = rs.getString("password");
                return storedPassword.equals(password);
            }
            return false;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
