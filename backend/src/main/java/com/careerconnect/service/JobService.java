package com.careerconnect.service;

import com.careerconnect.dto.JobRequest;
import com.careerconnect.dto.JobResponse;
import com.careerconnect.entity.Company;
import com.careerconnect.entity.Job;
import com.careerconnect.entity.User;
// import org.springframework.security.access.AccessDeniedException;
import com.careerconnect.exception.ResourceNotFoundException;
import com.careerconnect.repository.JobRepository;
import com.careerconnect.repository.SavedJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final AuthService authService;
    private final SavedJobRepository savedJobRepository;

    public JobService(JobRepository jobRepository,
                      CompanyService companyService,
                      AuthService authService,
                      SavedJobRepository savedJobRepository) {
        this.jobRepository = jobRepository;
        this.companyService = companyService;
        this.authService = authService;
        this.savedJobRepository = savedJobRepository;
    }

  
@Transactional(readOnly = true)
public List<JobResponse> searchJobs(
        String keyword,
        String location,
        String jobType,
        String experienceLevel,
        String status) {

    String cleanKeyword =
            keyword == null ? "" : keyword.trim();

    String cleanLocation =
            location == null ? "" : location.trim();

    String cleanJobType =
            jobType == null || jobType.isBlank()
                    || jobType.equalsIgnoreCase("ALL")
                    ? "" : jobType.trim();

    String cleanExperience =
            experienceLevel == null || experienceLevel.isBlank()
                    || experienceLevel.equalsIgnoreCase("ALL")
                    ? "" : experienceLevel.trim();

    String cleanStatus =
            status == null || status.isBlank()
                    ? "OPEN" : status.trim();

    List<Job> jobs = jobRepository.searchJobs(
            cleanKeyword,
            cleanLocation,
            cleanJobType,
            cleanExperience,
            cleanStatus
    );

    User currentUser = authService.getCurrentUserOrNull();

    return jobs.stream()
            .map(job -> toResponse(job, currentUser))
            .collect(Collectors.toList());
}


    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        User currentUser = authService.getCurrentUserOrNull();
        return toResponse(job, currentUser);
    }

    @Transactional(readOnly = true)
    public Job getJobEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    @Transactional
    public JobResponse createJob(JobRequest request) {
        User recruiter = authService.getCurrentAuthenticatedUser();
        if (!"ROLE_RECRUITER".equals(recruiter.getRole()) && !"ROLE_ADMIN".equals(recruiter.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("Only recruiters can post jobs");
        }

        Company company = companyService.findOrCreateCompany(
                request.getCompanyId(),
                request.getCompanyName(),
                request.getCompanyWebsite(),
                request.getCompanyLogoUrl()
        );

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        job.setSkills(request.getSkills());
        job.setDeadline(request.getDeadline());
        job.setStatus(request.getStatus() != null ? request.getStatus() : "OPEN");
        job.setCompany(company);
        job.setPostedBy(recruiter);

        Job savedJob = jobRepository.save(job);
        return toResponse(savedJob, recruiter);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = getJobEntityById(id);
        User currentUser = authService.getCurrentAuthenticatedUser();

        // Check if user is owner or admin
        if (!job.getPostedBy().getId().equals(currentUser.getId()) && !"ROLE_ADMIN".equals(currentUser.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to update this job");
        }

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getResponsibilities() != null) job.setResponsibilities(request.getResponsibilities());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        if (request.getExperienceLevel() != null) job.setExperienceLevel(request.getExperienceLevel());
        if (request.getSalaryMin() != null) job.setSalaryMin(request.getSalaryMin());
        if (request.getSalaryMax() != null) job.setSalaryMax(request.getSalaryMax());
        if (request.getCurrency() != null) job.setCurrency(request.getCurrency());
        if (request.getSkills() != null) job.setSkills(request.getSkills());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        if (request.getCompanyId() != null || (request.getCompanyName() != null && !request.getCompanyName().isBlank())) {
            Company company = companyService.findOrCreateCompany(
                    request.getCompanyId(),
                    request.getCompanyName(),
                    request.getCompanyWebsite(),
                    request.getCompanyLogoUrl()
            );
            job.setCompany(company);
        }

        Job updatedJob = jobRepository.save(job);
        return toResponse(updatedJob, currentUser);
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = getJobEntityById(id);
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (!job.getPostedBy().getId().equals(currentUser.getId()) && !"ROLE_ADMIN".equals(currentUser.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to delete this job");
        }

        jobRepository.delete(job);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyPostedJobs() {
        User recruiter = authService.getCurrentAuthenticatedUser();
        List<Job> jobs = jobRepository.findByPostedByIdOrderByCreatedAtDesc(recruiter.getId());
        return jobs.stream()
                .map(job -> toResponse(job, recruiter))
                .collect(Collectors.toList());
    }

    public JobResponse toResponse(Job job, User currentUser) {
        JobResponse resp = new JobResponse();
        resp.setId(job.getId());
        resp.setTitle(job.getTitle());
        resp.setDescription(job.getDescription());
        resp.setRequirements(job.getRequirements());
        resp.setResponsibilities(job.getResponsibilities());
        resp.setLocation(job.getLocation());
        resp.setJobType(job.getJobType());
        resp.setExperienceLevel(job.getExperienceLevel());
        resp.setSalaryMin(job.getSalaryMin());
        resp.setSalaryMax(job.getSalaryMax());
        resp.setCurrency(job.getCurrency());
        resp.setSkills(job.getSkills());
        resp.setDeadline(job.getDeadline());
        resp.setStatus(job.getStatus());
        resp.setCreatedAt(job.getCreatedAt());
        resp.setUpdatedAt(job.getUpdatedAt());

        if (job.getCompany() != null) {
            resp.setCompanyId(job.getCompany().getId());
            resp.setCompanyName(job.getCompany().getName());
            resp.setCompanyLogoUrl(job.getCompany().getLogoUrl());
            resp.setCompanyWebsite(job.getCompany().getWebsite());
            resp.setCompanyLocation(job.getCompany().getLocation());
            resp.setCompanyIndustry(job.getCompany().getIndustry());
        }

        if (job.getPostedBy() != null) {
            resp.setPostedById(job.getPostedBy().getId());
            resp.setPostedByName(job.getPostedBy().getName());
            resp.setPostedByEmail(job.getPostedBy().getEmail());
        }

        resp.setApplicationsCount(job.getApplications() != null ? job.getApplications().size() : 0);

        if (currentUser != null) {
            resp.setSavedByCurrentUser(savedJobRepository.existsByUserIdAndJobId(currentUser.getId(), job.getId()));
        } else {
            resp.setSavedByCurrentUser(false);
        }

        return resp;
    }
}
