package com.hospital.dto;

public class CreateAppointmentResponse {
    private boolean appointmentCreated;
    private String message;

    public CreateAppointmentResponse(boolean appointmentCreated, String message) {
        this.appointmentCreated = appointmentCreated;
        this.message = message;
    }

    public boolean isAppointmentCreated() {
        return appointmentCreated;
    }

    public void setAppointmentCreated(boolean appointmentCreated) {
        this.appointmentCreated = appointmentCreated;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
