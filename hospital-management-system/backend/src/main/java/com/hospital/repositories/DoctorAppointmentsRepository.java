package com.hospital.repositories;

import com.hospital.dto.DoctorAppointmentResponse;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DoctorAppointmentsRepository {

    public List<DoctorAppointmentResponse> getDoctorAppointmentsOnDate(long doctorId, LocalDate date) {

        // Sağlam filtre: [date 00:00, next day 00:00)
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        String sql =
            "SELECT a.aid, a.appt_datetime, a.status, a.pssn, p.fullname " +
            "FROM APPOINTMENT a " +
            "JOIN PATIENT p ON p.ssn = a.pssn " +
            "WHERE a.did = ? AND a.appt_datetime >= ? AND a.appt_datetime < ? " +
            "ORDER BY a.appt_datetime ASC";

        List<DoctorAppointmentResponse> out = new ArrayList<>();

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, doctorId);
            ps.setTimestamp(2, Timestamp.valueOf(start));
            ps.setTimestamp(3, Timestamp.valueOf(end));

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int appointmentId = rs.getInt("aid");
                String dt = rs.getTimestamp("appt_datetime").toLocalDateTime().toString();
                String status = rs.getString("status");

                // DoctorAppointmentResponse (appointmentId, dt, status, patientId, patientFullName)
                // Bizde patient_id yok -> placeholder 0 veriyoruz.
                // patientFullName olarak PATIENT.fullname veriyoruz.
                String patientFullName = rs.getString("fullname");

                out.add(new DoctorAppointmentResponse(appointmentId, dt, status, 0, patientFullName));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return out;
    }
}
