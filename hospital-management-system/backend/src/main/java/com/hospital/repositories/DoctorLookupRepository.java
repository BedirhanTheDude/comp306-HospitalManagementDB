package com.hospital.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;

import org.springframework.stereotype.Repository;

@Repository
public class DoctorLookupRepository {

    public Long findDoctorIdByUsername(String username) {
        String sql = "SELECT did FROM DOCTOR WHERE username = ?";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            var rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getLong("did");
            }
            return null;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
