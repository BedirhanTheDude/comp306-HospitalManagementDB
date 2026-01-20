package com.hospital.dto;

public class FindTestResultResponse {
    private int testID;
    private String testName;
    private double value;
    private double minRef;
    private double maxRef;
    private String units;
    private boolean isBetweenRange;
    private int year;
    private int month;
    private int day;
    private int hour;
    private int minute;
    private int second;

    public FindTestResultResponse(
            int testID, String testName, double value, double minRef, double maxRef, String units, boolean isBetweenRange,
            int year, int month, int day, int hour, int minute, int second) {
        this.testID = testID;
        this.testName = testName;
        this.value = value;
        this.minRef = minRef;
        this.maxRef = maxRef;
        this.units = units;
        this.isBetweenRange = isBetweenRange;
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    public int getTestID() {
        return testID;
    }

    public void setTestID(int testID) {
        this.testID = testID;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public double getMinRef() {
        return minRef;
    }

    public void setMinRef(double minRef) {
        this.minRef = minRef;
    }

    public double getMaxRef() {
        return maxRef;
    }

    public void setMaxRef(double maxRef) {
        this.maxRef = maxRef;
    }

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }

    public boolean isBetweenRange() {
        return isBetweenRange;
    }

    public void setBetweenRange(boolean betweenRange) {
        isBetweenRange = betweenRange;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public int getSecond() {
        return second;
    }

    public void setSecond(int second) {
        this.second = second;
    }
}
