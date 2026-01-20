package com.hospital.dto;

// Response of finding existing appointments belonging to a patient
public class FindAppointmentResponse {
    private int appointmentID;
    private int year;
    private int month;
    private int day;
    private int hour;
    private int minute;
    private String status;
    private double price;
    private String doctorFullName;
    private String doctorGender;

    public FindAppointmentResponse(
            int appointmentID, int year, int month, int day, int hour, int minute,
            String status, double price, String doctorFullName, String doctorGender) {
        this.appointmentID = appointmentID;
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.status = status;
        this.price = price;
        this.doctorFullName = doctorFullName;
        this.doctorGender = doctorGender;
    }

    public int getAppointmentID() {
        return appointmentID;
    }

    public void setAppointmentID(int appointmentID) {
        this.appointmentID = appointmentID;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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
}
