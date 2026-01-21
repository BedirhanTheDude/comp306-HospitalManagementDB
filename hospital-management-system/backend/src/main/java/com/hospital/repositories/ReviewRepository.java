package com.hospital.repositories;

import com.hospital.dto.CreateReviewRequest;
import com.hospital.dto.CreateReviewResponse;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

@Repository
public class ReviewRepository {

    public static CreateReviewResponse createReview(CreateReviewRequest request) {
        String tryFindExistingReview = """
                SELECT 1 FROM REVIEW WHERE aid = ?
                """;

        String findNewReviewID = """
                SELECT COUNT(*) + 1 FROM REVIEW
                """;

        String findDoctorAndPatient = """
                SELECT D.did, A.pssn FROM DOCTOR D JOIN APPOINTMENT A ON D.did = A.did
                WHERE A.aid = ?
                """;

        String insertNewReview = """
                INSERT INTO REVIEW(rid, rating, comment, created_at, pssn, did, aid)
                VALUES(?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conn = DB.getConnection()) {
            PreparedStatement findExistingStatement = conn.prepareStatement(tryFindExistingReview);
            findExistingStatement.setInt(1, request.getAppointmentID());

            ResultSet existingReviewSet = findExistingStatement.executeQuery();
            if (existingReviewSet.next())
                return new CreateReviewResponse(
                        false, "You already left a review for this appointment.");

            PreparedStatement findNewIDStatement = conn.prepareStatement(findNewReviewID);
            ResultSet newIDSet = findNewIDStatement.executeQuery();
            newIDSet.next();
            int newID = newIDSet.getInt(1);

            PreparedStatement findDoctorAndPatientStatement = conn.prepareStatement(findDoctorAndPatient);
            findDoctorAndPatientStatement.setInt(1, request.getAppointmentID());
            ResultSet IDset = findDoctorAndPatientStatement.executeQuery();
            IDset.next();
            int doctorID = IDset.getInt("did");
            int patientSSN = IDset.getInt("pssn");

            PreparedStatement insertNewReviewStatement = conn.prepareStatement(insertNewReview);
            insertNewReviewStatement.setInt(1, newID);
            insertNewReviewStatement.setInt(2, request.getRating());
            insertNewReviewStatement.setString(3, request.getComment());
            insertNewReviewStatement.setObject(4, LocalDateTime.now());
            insertNewReviewStatement.setInt(5, patientSSN);
            insertNewReviewStatement.setInt(6, doctorID);
            insertNewReviewStatement.setInt(7, request.getAppointmentID());

            int rows = insertNewReviewStatement.executeUpdate();
            if (rows > 0) {
                return new CreateReviewResponse(true, "Review added successfully!");
            } else return new CreateReviewResponse(false, "Couldn't add new review.");

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
