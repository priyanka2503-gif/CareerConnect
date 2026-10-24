package com.careerconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, REVIEWING, SHORTLISTED, INTERVIEWING, ACCEPTED, REJECTED

    private String notes;

    public ApplicationStatusUpdateRequest() {
    }

    public ApplicationStatusUpdateRequest(String status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
