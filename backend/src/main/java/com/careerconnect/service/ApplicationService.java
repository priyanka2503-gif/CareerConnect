package com.careerconnect.service;

import com.careerconnect.dto.ApplicationRequest;
import com.careerconnect.dto.ApplicationResponse;
import com.careerconnect.dto.ApplicationStatusUpdateRequest;
import com.careerconnect.entity.Application;
import com.careerconnect.entity.Job;
import com.careerconnect.entity.User;
import com.careerconnect.exception.BadRequestException;
import com.careerconnect.exception.ResourceNotFoundException;
import com.careerconnect.repository.ApplicationRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final AuthService authService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobService jobService,
                              AuthService authService) {
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
        this.authService = authService;
    }

    @Transactional
    public ApplicationResponse applyForJob(ApplicationRequest request) {
        User applicant = authService.getCurrentAuthenticatedUser();
        Job job = jobService.getJobEntityById(request.getJobId());

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new BadRequestException("This job posting is closed for applications");
        }

        if (applicationRepository.existsByJobIdAndApplicantId(job.getId(), applicant.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setApplicant(applicant);

        String resumeUrl = request.getResumeUrl();
        if (resumeUrl == null || resumeUrl.isBlank()) {
            resumeUrl = applicant.getResumeUrl();
        }
        application.setResumeUrl(resumeUrl);
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus("PENDING");

        Application saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        User applicant = authService.getCurrentAuthenticatedUser();
        List<Application> applications = applicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicant.getId());
        return applications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {
        User recruiter = authService.getCurrentAuthenticatedUser();
        Job job = jobService.getJobEntityById(jobId);

        if (!job.getPostedBy().getId().equals(recruiter.getId()) && !"ROLE_ADMIN".equals(recruiter.getRole())) {
            throw new AccessDeniedException("You are not authorized to view applications for this job");
        }

        List<Application> applications = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
        return applications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplicationsForRecruiter() {
        User recruiter = authService.getCurrentAuthenticatedUser();
        List<Application> applications = applicationRepository.findByRecruiterIdOrderByAppliedAtDesc(recruiter.getId());
        return applications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Ensure the current user is the recruiter who posted the job or an admin
        Job job = application.getJob();
        if (!job.getPostedBy().getId().equals(currentUser.getId()) && !"ROLE_ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("You are not authorized to update this application status");
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            application.setStatus(request.getStatus().toUpperCase());
        }

        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        Application updated = applicationRepository.save(application);
        return toResponse(updated);
    }

    public ApplicationResponse toResponse(Application application) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(application.getId());

        Job job = application.getJob();
        if (job != null) {
            resp.setJobId(job.getId());
            resp.setJobTitle(job.getTitle());
            resp.setLocation(job.getLocation());
            resp.setJobType(job.getJobType());
            resp.setSalaryMin(job.getSalaryMin());
            resp.setSalaryMax(job.getSalaryMax());
            resp.setCurrency(job.getCurrency());

            if (job.getCompany() != null) {
                resp.setCompanyName(job.getCompany().getName());
                resp.setCompanyLogoUrl(job.getCompany().getLogoUrl());
            }
        }

        User applicant = application.getApplicant();
        if (applicant != null) {
            resp.setApplicantId(applicant.getId());
            resp.setApplicantName(applicant.getName());
            resp.setApplicantEmail(applicant.getEmail());
            resp.setApplicantPhone(applicant.getPhone());
            resp.setApplicantHeadline(applicant.getHeadline());
        }

        resp.setResumeUrl(application.getResumeUrl());
        resp.setCoverLetter(application.getCoverLetter());
        resp.setStatus(application.getStatus());
        resp.setNotes(application.getNotes());
        resp.setAppliedAt(application.getAppliedAt());
        resp.setUpdatedAt(application.getUpdatedAt());

        return resp;
    }
}
