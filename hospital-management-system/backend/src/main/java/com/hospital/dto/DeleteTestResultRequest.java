package com.hospital.dto;

public class DeleteTestResultRequest {
    private int testID;

    public DeleteTestResultRequest() {}

    public DeleteTestResultRequest(int testID) {
        this.testID = testID;
    }

    public int getTestID() {
        return testID;
    }

    public void setTestID(int testID) {
        this.testID = testID;
    }
}
