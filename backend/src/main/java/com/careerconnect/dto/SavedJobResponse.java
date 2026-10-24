package com.careerconnect.dto;

import java.time.LocalDateTime;

public class SavedJobResponse {

    private Long id;
    private JobResponse job;
    private LocalDateTime savedAt;

    public SavedJobResponse() {
    }

    public SavedJobResponse(Long id, JobResponse job, LocalDateTime savedAt) {
        this.id = id;
        this.job = job;
        this.savedAt = savedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobResponse getJob() {
        return job;
    }

    public void setJob(JobResponse job) {
        this.job = job;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }
}
