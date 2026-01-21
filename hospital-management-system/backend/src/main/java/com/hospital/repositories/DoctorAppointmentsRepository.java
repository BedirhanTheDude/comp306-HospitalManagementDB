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

    // 🔹 Belirli gün (date picker için)
    public List<DoctorAppointmentResponse> getDoctorAppointmentsOnDate(long doctorId, LocalDate date) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        String sql =
            "SELECT a.aid, a.appt_datetime, a.status, p.fullname " +
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
                out.add(new DoctorAppointmentResponse(
                        rs.getInt("aid"),
                        rs.getTimestamp("appt_datetime").toLocalDateTime().toString(),
                        rs.getString("status"),
                        0,
                        rs.getString("fullname")
                ));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return out;
    }

    // 🔹 BUGÜN / GELECEK RANDEVULAR (GARANTİLİ ÇALIŞAN)
    public List<DoctorAppointmentResponse> getUpcomingAppointments(long doctorId) {

        String sql =
            "SELECT a.aid, a.appt_datetime, a.status, p.fullname " +
            "FROM APPOINTMENT a " +
            "JOIN PATIENT p ON p.ssn = a.pssn " +
            "WHERE a.did = ? AND a.appt_datetime >= NOW() " +
            "ORDER BY a.appt_datetime ASC";

        List<DoctorAppointmentResponse> out = new ArrayList<>();

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, doctorId);

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                out.add(new DoctorAppointmentResponse(
                        rs.getInt("aid"),
                        rs.getTimestamp("appt_datetime").toLocalDateTime().toString(),
                        rs.getString("status"),
                        0,
                        rs.getString("fullname")
                ));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return out;
    }
}
