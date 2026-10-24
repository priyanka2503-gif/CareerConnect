package com.careerconnect.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String resumeUrl;
    private String coverLetter;

    public ApplicationRequest() {
    }

    public ApplicationRequest(Long jobId, String resumeUrl, String coverLetter) {
        this.jobId = jobId;
        this.resumeUrl = resumeUrl;
        this.coverLetter = coverLetter;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
