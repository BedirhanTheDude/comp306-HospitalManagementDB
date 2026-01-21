package com.hospital.dto;

public class DoctorAppointmentResponse {
    private int appointmentId;
    private String appointmentDateTime; // ISO string
    private String status;
    private int patientId;
    private String patientFullName;

    public DoctorAppointmentResponse(int appointmentId, String appointmentDateTime, String status,
                                 int patientId, String patientFullName) {
        this.appointmentId = appointmentId;
        this.appointmentDateTime = appointmentDateTime;
        this.status = status;
        this.patientId = patientId;
        this.patientFullName = patientFullName;
    }

    public int getAppointmentId() { return appointmentId; }
    public String getAppointmentDateTime() { return appointmentDateTime; }
    public String getStatus() { return status; }
    public int getPatientId() { return patientId; }
    public String getPatientFullName() { return patientFullName; }
}
