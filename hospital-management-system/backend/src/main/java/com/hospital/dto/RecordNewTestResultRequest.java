package com.hospital.dto;

public class RecordNewTestResultRequest {
    private int typeID;
    private int patientSSN;
    private double value;

    public RecordNewTestResultRequest(int typeID, int patientSSN, double value) {
        this.typeID = typeID;
        this.patientSSN = patientSSN;
        this.value = value;
    }

    public int getTypeID() {
        return typeID;
    }

    public void setTypeID(int typeID) {
        this.typeID = typeID;
    }

    public int getPatientSSN() {
        return patientSSN;
    }

    public void setPatientSSN(int patientSSN) {
        this.patientSSN = patientSSN;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
