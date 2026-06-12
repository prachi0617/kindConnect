package com.kindconnect.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class HelpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String requestType;

    @Column(length = 1000)
    private String message;

    private String preferredDay;
    private String preferredTime;
    private String urgency;

    private String status = "Pending";

    private Boolean completed = false;

    public HelpRequest() {
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getRequestType() {
        return requestType;
    }

    public String getMessage() {
        return message;
    }

    public String getPreferredDay() {
        return preferredDay;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public String getUrgency() {
        return urgency;
    }

    public String getStatus() {
        return status;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPreferredDay(String preferredDay) {
        this.preferredDay = preferredDay;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}