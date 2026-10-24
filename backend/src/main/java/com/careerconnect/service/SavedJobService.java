package com.careerconnect.service;

import com.careerconnect.dto.SavedJobResponse;
import com.careerconnect.entity.Job;
import com.careerconnect.entity.SavedJob;
import com.careerconnect.entity.User;
import com.careerconnect.exception.BadRequestException;
import com.careerconnect.repository.SavedJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobService jobService;
    private final AuthService authService;

    public SavedJobService(SavedJobRepository savedJobRepository,
                           JobService jobService,
                           AuthService authService) {
        this.savedJobRepository = savedJobRepository;
        this.jobService = jobService;
        this.authService = authService;
    }

    @Transactional
    public SavedJobResponse saveJob(Long jobId) {
        User user = authService.getCurrentAuthenticatedUser();
        Job job = jobService.getJobEntityById(jobId);

        if (savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            throw new BadRequestException("Job is already in your saved jobs list");
        }

        SavedJob savedJob = new SavedJob(job, user);
        SavedJob saved = savedJobRepository.save(savedJob);

        return new SavedJobResponse(saved.getId(), jobService.toResponse(job, user), saved.getSavedAt());
    }

    @Transactional
    public void unsaveJob(Long jobId) {
        User user = authService.getCurrentAuthenticatedUser();
        savedJobRepository.findByUserIdAndJobId(user.getId(), jobId)
                .ifPresent(savedJobRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<SavedJobResponse> getMySavedJobs() {
        User user = authService.getCurrentAuthenticatedUser();
        List<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderBySavedAtDesc(user.getId());

        return savedJobs.stream()
                .map(sj -> new SavedJobResponse(
                        sj.getId(),
                        jobService.toResponse(sj.getJob(), user),
                        sj.getSavedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isJobSaved(Long jobId) {
        User user = authService.getCurrentUserOrNull();
        if (user == null) {
            return false;
        }
        return savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId);
    }
}
