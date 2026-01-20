package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;
@Repository
public class HospitalBranchRepository {

    public static List<String> getAllCities() {
        // Implementation to fetch all cities from the database
        String sql = "SELECT DISTINCT city FROM HOSPITAL_BRANCH";
        // Execute the query and build the list

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            List<String> cities = new ArrayList<>();

            while (rs.next()) {
                cities.add(rs.getString("city"));
            }
            return cities;

        } catch (SQLException e) {
            System.out.println("Error fetching cities: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
}
