package com.hospital.dto;

public class DoctorSearchRequest {
    private String policlinicName;
    private String cityName;
    private Double minRating;
    private Double maxRating;

    public DoctorSearchRequest(String policlinicName, String cityName, Double minRating, Double maxRating) {
        this.policlinicName = policlinicName;
        this.cityName = cityName;
        this.minRating = minRating;
        this.maxRating = maxRating;
    }

    public String getPoliclinicName() {
        return policlinicName;
    }

    public void setPoliclinicName(String policlinicName) {
        this.policlinicName = policlinicName;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public Double getMinRating() {
        return minRating;
    }

    public void setMinRating(Double minRating) {
        this.minRating = minRating;
    }

    public Double getMaxRating() {
        return maxRating;
    }

    public void setMaxRating(Double maxRating) {
        this.maxRating = maxRating;
    }
}
