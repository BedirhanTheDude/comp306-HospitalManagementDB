package com.hospital.dto;

public class CancelAppointmentRequest {
    private int appointmentID;

    public CancelAppointmentRequest() {
    }

    public CancelAppointmentRequest(int appointmentID) {
        this.appointmentID = appointmentID;
    }

    public int getAppointmentID() {
        return appointmentID;
    }

    public void setAppointmentID(int appointmentID) {
        this.appointmentID = appointmentID;
    }
}
