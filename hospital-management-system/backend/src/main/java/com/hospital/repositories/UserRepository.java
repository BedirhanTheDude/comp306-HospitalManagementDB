package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository {
     public static void insertUser(String fullName, String password, String userType) {
        String sql = "INSERT INTO USER(user_name, password_hash, user_type) VALUES (?, ?, ?)";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, fullName);
            ps.setString(2, password);
            ps.setString(3, userType);

            ps.executeUpdate(); // INSERT çalıştırır
            System.out.println("User inserted successfully!");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
