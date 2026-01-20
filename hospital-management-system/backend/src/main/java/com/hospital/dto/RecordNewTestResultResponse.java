package com.hospital.dto;

public class RecordNewTestResultResponse {
    private Integer newTestID;
    private boolean success;
    private String message;

    public RecordNewTestResultResponse(Integer newTestID, boolean success, String message) {
        this.newTestID = newTestID;
        this.success = success;
        this.message = message;
    }

    public Integer getNewTestID() {
        return newTestID;
    }

    public void setNewTestID(Integer newTestID) {
        this.newTestID = newTestID;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
