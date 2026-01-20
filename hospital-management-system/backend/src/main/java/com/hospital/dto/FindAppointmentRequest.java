package com.hospital.dto;

// Request for finding the existing appointments belonging to a patient
public class FindAppointmentRequest {
    private int patientSSN;

    public FindAppointmentRequest() {}

    public FindAppointmentRequest(int patientSSN) {
        this.patientSSN = patientSSN;
    }

    public int getPatientSSN() {
        return patientSSN;
    }

    public void setPatientSSN(int patientSSN) {
        this.patientSSN = patientSSN;
    }
}
