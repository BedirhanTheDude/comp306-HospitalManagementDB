package com.hospital.dto;

public class CancelAppointmentResponse {
    private boolean appointmentCancelled;
    private String message;

    public CancelAppointmentResponse(boolean appointmentCancelled, String message) {
        this.appointmentCancelled = appointmentCancelled;
        this.message = message;
    }

    public boolean isAppointmentCancelled() {
        return appointmentCancelled;
    }

    public void setAppointmentCancelled(boolean appointmentCancelled) {
        this.appointmentCancelled = appointmentCancelled;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
