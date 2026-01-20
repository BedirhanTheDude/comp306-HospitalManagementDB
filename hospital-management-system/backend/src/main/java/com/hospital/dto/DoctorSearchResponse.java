package com.hospital.dto;

public class DoctorSearchResponse {
    private String doctorFullName;
    private String doctorGender;
    private Double doctorRating;
    private int doctorId;

    public DoctorSearchResponse(String doctorFullName, String doctorGender, Double doctorRating) {
        this.doctorFullName = doctorFullName;
        this.doctorGender = doctorGender;
        this.doctorRating = doctorRating;
        this.doctorId = doctorId;
    }

    public String getDoctorFullName() {
        return doctorFullName;
    }

    public void setDoctorFullName(String doctorFullName) {
        this.doctorFullName = doctorFullName;
    }

    public String getDoctorGender() {
        return doctorGender;
    }

    public void setDoctorGender(String doctorGender) {
        this.doctorGender = doctorGender;
    }

    public Double getDoctorRating() {
        return doctorRating;
    }

    public void setDoctorRating(Double doctorRating) {
        this.doctorRating = doctorRating;
    }
    public int getDoctorId() {
        return doctorId;
    }
    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }
    
}
