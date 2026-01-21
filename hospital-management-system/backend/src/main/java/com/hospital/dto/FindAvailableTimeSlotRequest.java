package com.hospital.dto;

public class FindAvailableTimeSlotRequest {
    private int year;
    private int month;
    private int day;
    private int doctorID;

    public FindAvailableTimeSlotRequest(int year, int month, int day, int doctorID) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.doctorID = doctorID;
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

    public int getDoctorID() {
        return doctorID;
    }

    public void setDoctorID(int doctorID) {
        this.doctorID = doctorID;
    }
}
