package com.hospital.dto;

public class FindTestResultRequest { // Can add filters if necessary
    private int patientSSN;

    public FindTestResultRequest() {}

    public FindTestResultRequest(int patientSSN) {
        this.patientSSN = patientSSN;
    }

    public int getPatientSSN() {
        return patientSSN;
    }

    public void setPatientSSN(int patientSSN) {
        this.patientSSN = patientSSN;
    }
}
