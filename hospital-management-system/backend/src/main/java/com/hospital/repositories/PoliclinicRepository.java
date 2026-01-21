package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class PoliclinicRepository {

    public static List<String> getAllPoliclinics() {
        // Implementation to fetch all policlinics from the database
        String sql = "SELECT DISTINCT name FROM POLICLINIC";
        // Execute the query and build the list
        

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            List<String> policlinics = new ArrayList<>();

            while (rs.next()) {
                policlinics.add(rs.getString("name"));
            }
            return policlinics;

        } catch (SQLException e) {
            System.out.println("Error inserting user: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
}
