package com.hospital.repositories;

import com.hospital.dto.*;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Repository
public class TestResultRepository {

    public static List<FindTestResultResponse> findTestResults(FindTestResultRequest request) {
        List<FindTestResultResponse> result = new ArrayList<>();

        String sql = """
                SELECT TR.test_id, TT.name AS test_name, TR.value, TT.min_ref,
                 TT.max_ref, TT.unit, TR.measured_at as date
                FROM TEST_RESULT TR JOIN TEST_TYPE TT ON TR.type_id = TT.type_id
                WHERE TR.pssn = ?
                """;

        try (Connection conn = DB.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, request.getPatientSSN());

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                LocalDateTime date = rs.getObject("date", LocalDateTime.class);
                int year = date.getYear();
                int month = date.getMonthValue();
                int day = date.getDayOfMonth();
                int hour = date.getHour();
                int minute = date.getMinute();
                int second = date.getSecond();

                double value = rs.getDouble("value");
                double minRef = rs.getDouble("min_ref");
                double maxRef = rs.getDouble("max_ref");
                boolean isBetweenRange = value >= minRef && value <= maxRef;

                FindTestResultResponse response = new FindTestResultResponse(
                        rs.getInt("test_id"), rs.getString("test_name"),
                        value, minRef, maxRef, rs.getString("unit"), isBetweenRange,
                        year, month, day, hour, minute, second
                );

                result.add(response);
            }

            return result;
        } catch (SQLException e) {
            throw new RuntimeException("Error during test search.", e);
        }
    }

    public static RecordNewTestResultResponse recordNewTest(RecordNewTestResultRequest request) {
        String insertSQL = """
                INSERT INTO TEST_RESULT(test_id, value, measured_at, type_id, pssn)
                VALUES (?, ?, ?, ?, ?)
                """;

        String findID = """
                SELECT COUNT(*) + 1 FROM TEST_RESULT;
                """;

        try(Connection conn = DB.getConnection()) {
            PreparedStatement findIDStatement = conn.prepareStatement(findID);
            ResultSet idSet = findIDStatement.executeQuery();
            idSet.next(); int newID = idSet.getInt(1);

            LocalDateTime now = LocalDateTime.now();
            PreparedStatement insertStatement = conn.prepareStatement(insertSQL);
            insertStatement.setInt(1, newID);
            insertStatement.setDouble(2, request.getValue());
            insertStatement.setObject(3, now);
            insertStatement.setInt(4, request.getTypeID());
            insertStatement.setInt(5, request.getPatientSSN());

            int rows = insertStatement.executeUpdate();
            if (rows > 0)
                return new RecordNewTestResultResponse(newID, true, "Test result recorded successfully.");
            else
                return new RecordNewTestResultResponse(null, false, "Couldn't record test result.");
        } catch (SQLException e) {
            return new RecordNewTestResultResponse(null, false, "Unexpected error during insertion.");
        }
    }

    public static DeleteTestResultResponse deleteTestResult(DeleteTestResultRequest request) {
        String sql = "DELETE FROM TEST_RESULT WHERE test_id = ?";

        try (Connection conn = DB.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, request.getTestID());

            int rows = ps.executeUpdate();
            if (rows > 0)
                return new DeleteTestResultResponse(true, "Test result deleted successfully.");
            else return new DeleteTestResultResponse(false, "Couldn't find test to delete.");
        } catch (SQLException e) {
            return new DeleteTestResultResponse(false, "Unexpected error during insertion.");
        }
    }
}
