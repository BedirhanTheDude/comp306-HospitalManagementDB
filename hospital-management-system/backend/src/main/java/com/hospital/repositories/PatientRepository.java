package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

@Repository
public class PatientRepository {
     public static void insertPatient(String identityNumber, String fullName, String gender, String phoneNumber, String dateOfBirth) {
        String sql = "INSERT INTO PATIENT(ssn, fullname, gender, phone, dob) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, identityNumber);
            ps.setString(2, fullName);
            ps.setString(3, gender);
            ps.setString(4, phoneNumber);
            ps.setString(5, dateOfBirth);

            ps.executeUpdate(); // INSERT çalıştırır
            System.out.println("User inserted successfully!");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
