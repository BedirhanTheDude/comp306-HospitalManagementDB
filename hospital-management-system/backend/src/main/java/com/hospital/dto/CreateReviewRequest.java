package com.hospital.dto;

public class CreateReviewRequest {
    private int appointmentID;
    private int rating;
    private String comment;

    public CreateReviewRequest(int appointmentID, int rating, int patientSSN, String comment) {
        this.appointmentID = appointmentID;
        this.rating = (rating > 5) ? 5 : Math.max(1, rating); // Clamp rating 1-5
        this.comment = comment;
    }

    public int getAppointmentID() {
        return appointmentID;
    }

    public void setAppointmentID(int appointmentID) {
        this.appointmentID = appointmentID;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = (rating > 5) ? 5 : Math.max(1, rating);
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
