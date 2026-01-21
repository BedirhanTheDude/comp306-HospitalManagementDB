package com.hospital.repositories;

import com.hospital.dto.*;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.security.SecureRandom;

@Repository
public class AppointmentRepository {
    public static List<DoctorSearchResponse> searchDoctor(DoctorSearchRequest request) {
        List<DoctorSearchResponse> results = new ArrayList<>();

        StringBuilder sql = new StringBuilder("""
            SELECT E.fullname AS fullname, E.gender AS gender, ROUND(AVG(R.rating), 2) AS doctorRating, D.did
            FROM DOCTOR D
            JOIN EMPLOYEE E ON D.ssn = E.ssn
            JOIN POLICLINIC P ON D.poid = P.poid
            JOIN HOSPITAL_BRANCH HB ON P.bid = HB.bid
            LEFT JOIN REVIEW R ON D.did = R.did
            WHERE 1=1
        """); // 1=1 is so that we can safely append AND to where clause

        List<Object> params = new ArrayList<>();
        if (request.getPoliclinicName() != null && !request.getPoliclinicName().isBlank()) {
            sql.append(" AND P.name = ?");
            params.add(request.getPoliclinicName());
        }

        if (request.getCityName() != null && !request.getCityName().isBlank()) {
            sql.append(" AND HB.city = ?");
            params.add(request.getCityName());
        }

        sql.append("GROUP BY D.did, E.fullname, E.gender");

        boolean hasRatingFilter = request.getMinRating() != null || request.getMaxRating() != null;

        if (hasRatingFilter) {
            sql.append(" HAVING 1=1"); // 1=1 is so that we can safely append AND to the having clause

            if (request.getMinRating() != null) {
                sql.append(" AND AVG(R.rating) >= ?");
                params.add(request.getMinRating());
            }

            if (request.getMaxRating() != null) {
                sql.append(" AND AVG(R.rating) <= ?");
                params.add(request.getMaxRating());
            }
        }

        sql.append(" ORDER BY AVG(R.rating) DESC");

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            ResultSet rs = ps.executeQuery();

            while(rs.next()) {
                DoctorSearchResponse dto = new DoctorSearchResponse(
                        rs.getString("fullname"),
                        rs.getString("gender"),
                        rs.getDouble("doctorRating"),
                        rs.getInt("did")
                );

                results.add(dto);
            }

            return results;
        } catch (SQLException e) {
            throw new RuntimeException("Doctor search failed", e);
        }
    }

    public static CreateAppointmentResponse createAppointment(CreateAppointmentRequest request) {
        LocalDateTime appointmentDate = LocalDateTime.of(
                request.getYear(),
                request.getMonth(),
                request.getDay(),
                request.getHour(),
                request.getMinute()
        );

        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(appointmentDate)) {
            return new CreateAppointmentResponse(
                    false, "Can't make an appointment for a past date.");
        }

        String findNewID = "SELECT COUNT(*) + 1 AS newID FROM APPOINTMENT";
        String findExistingAppointment = """
                SELECT A.did AS doctorID
                FROM APPOINTMENT A
                WHERE A.pssn = ? AND A.appt_datetime = ?
                """;
        String insertAppointment = """
                INSERT INTO APPOINTMENT(aid, appt_datetime, status, price, pssn, did)
                VALUES(?, ?, 'Scheduled', ?, ?, ?)
                """;
        String findAppointmentOfDoctor = """
                SELECT *
                FROM APPOINTMENT A
                WHERE A.did = ? AND A.appt_datetime = ?
                """;

        try (Connection conn = DB.getConnection()) {
            PreparedStatement findApptStatement = conn.prepareStatement(findExistingAppointment);
            findApptStatement.setInt(1, request.getPatientSSN());
            findApptStatement.setObject(2, appointmentDate);

            ResultSet findApptResult = findApptStatement.executeQuery();
            if (findApptResult.next()) {
                int existingDoctorID = findApptResult.getInt("doctorID");
                if (existingDoctorID == request.getDoctorID())
                    return new CreateAppointmentResponse(
                            false, "Patient already has appointment with this doctor on this date.");
                else return new CreateAppointmentResponse(
                        false, "Patient has another appointment with a different doctor on this date.");
            }

            PreparedStatement findDocApptStatement = conn.prepareStatement(findAppointmentOfDoctor);
            findDocApptStatement.setInt(1, request.getDoctorID());
            findDocApptStatement.setObject(2, appointmentDate);

            ResultSet doctorApptResult = findDocApptStatement.executeQuery();
            if (doctorApptResult.next())
                return new CreateAppointmentResponse(
                        false, "Doctor has an appointment on the requested date.");

            PreparedStatement findNewIDStatement = conn.prepareStatement(findNewID);
            ResultSet newIDResult = findNewIDStatement.executeQuery();
            newIDResult.next();
            int newID = newIDResult.getInt("newID");

            SecureRandom secureRandom = new SecureRandom();
            double price = secureRandom.nextDouble() * 400 + 100; // Random price between 100-500

            PreparedStatement insertAppointmentStatement = conn.prepareStatement(insertAppointment);
            insertAppointmentStatement.setInt(1, newID);
            insertAppointmentStatement.setObject(2, appointmentDate);
            insertAppointmentStatement.setDouble(3, price);
            insertAppointmentStatement.setInt(4, request.getPatientSSN());
            insertAppointmentStatement.setInt(5, request.getDoctorID());

            int rows = insertAppointmentStatement.executeUpdate();
            if (rows > 0)
                return new CreateAppointmentResponse(
                        true, "Appointment created successfully.");
            else return new CreateAppointmentResponse(
                    false, "Couldn't insert appointment to database.");

        } catch (SQLException e) {
            throw new RuntimeException("Unexpected error during appointment insertion.", e);
        }
    }

    public static CancelAppointmentResponse cancelAppointment(CancelAppointmentRequest request) {
        String deleteSQL = """
                DELETE FROM APPOINTMENT WHERE aid = ?
                """;
        String findApptSQL = """
                SELECT status FROM APPOINTMENT WHERE aid = ?
                """;

        try (Connection conn = DB.getConnection()) {
            PreparedStatement findStatement = conn.prepareStatement(findApptSQL);
            findStatement.setInt(1, request.getAppointmentID());

            ResultSet rs = findStatement.executeQuery();
            rs.next();
            String status = rs.getString(1);
            if (status.equalsIgnoreCase("completed")) {
                return new CancelAppointmentResponse(
                        false, "Can't cancel an appointment that's completed.");
            }

            PreparedStatement deleteStatement = conn.prepareStatement(deleteSQL);
            deleteStatement.setInt(1, request.getAppointmentID());
            int rows = deleteStatement.executeUpdate();
            if (rows > 0) {
                return new CancelAppointmentResponse(
                        true, "Appointment cancelled successfully.");
            } else return new CancelAppointmentResponse(
                    false, "Couldn't find appointment to cancel.");
        } catch (SQLException e) {
            throw new RuntimeException("Error during appointment cancellation.", e);
        }
    }

    // Finds all appointments belonging to a patient
    public static List<FindAppointmentResponse> findAppointments(FindAppointmentRequest request) {
        List<FindAppointmentResponse> result = new ArrayList<>();
        String sql = """
                SELECT A.aid, A.appt_datetime as date, A.status, A.price, E.fullname, E.gender
                FROM APPOINTMENT A
                JOIN DOCTOR D ON A.did = D.did
                JOIN EMPLOYEE E ON D.ssn = E.ssn
                WHERE A.pssn = ?
                """;

        try(Connection conn = DB.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, request.getPatientSSN());

            ResultSet rs = ps.executeQuery();
            while(rs.next()) {
                LocalDateTime date = rs.getObject("date", LocalDateTime.class);
                int year = date.getYear();
                int month = date.getMonthValue();
                int day = date.getDayOfMonth();
                int hour = date.getHour();
                int minute = date.getMinute();

                FindAppointmentResponse response = new FindAppointmentResponse(
                        rs.getInt("aid"),
                        year, month, day, hour, minute,
                        rs.getString("status"),
                        rs.getDouble("price"),
                        rs.getString("fullname"),
                        rs.getString("gender")
                );

                result.add(response);
            }

            return result;
        } catch (SQLException e) {
            throw new RuntimeException("Error during appointment search.", e);
        }
    }

    public static List<FindAvailableTimeSlotResponse> findAvailableTimeSlots(FindAvailableTimeSlotRequest request) {
        List<FindAvailableTimeSlotResponse> result = new ArrayList<>();

        List<LocalTime> slots = new ArrayList<>();
        for (int hour = 8; hour < 17; hour++) {
            LocalTime slot1 = LocalTime.of(hour, 0);
            LocalTime slot2 = LocalTime.of(hour, 30);
            slots.add(slot1);
            slots.add(slot2);
        }
        slots.add(LocalTime.of(17, 0)); // Add the last slot at 17.00

        List<LocalTime> occupiedSlots = new ArrayList<>();
        List<LocalTime> freeSlots = new ArrayList<>();

        String sql = """
                SELECT appt_datetime AS date FROM APPOINTMENT
                WHERE appt_datetime <= ? AND appt_datetime >= ? AND did = ?
                """;

        try (Connection conn = DB.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(sql);
            LocalDateTime dayBeginning = LocalDateTime.of(
                    request.getYear(), request.getMonth(), request.getDay(), 0, 0,0);
            LocalDateTime dayEnd = LocalDateTime.of(
                    request.getYear(), request.getMonth(), request.getDay(), 23, 59, 59);

            ps.setObject(1, dayEnd);
            ps.setObject(2, dayBeginning);
            ps.setInt(3, request.getDoctorID());

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                LocalDateTime date = rs.getObject("date", LocalDateTime.class);
                occupiedSlots.add(LocalTime.of(date.getHour(), date.getMinute()));
            }

            for (LocalTime slot : slots) {
                boolean isOccupied = false;
                for (LocalTime occupiedSlot : occupiedSlots) {
                    if (slot.equals(occupiedSlot)) {
                        isOccupied = true;
                        break;
                    }
                }

                if (!isOccupied)
                    freeSlots.add(slot);
            }

            for (LocalTime freeSlot : freeSlots) {
                FindAvailableTimeSlotResponse response =
                        new FindAvailableTimeSlotResponse(freeSlot.getHour(), freeSlot.getMinute());

                result.add(response);
            }

            return result;
        } catch(SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
