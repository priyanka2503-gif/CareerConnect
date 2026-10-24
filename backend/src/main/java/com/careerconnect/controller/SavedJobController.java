package com.careerconnect.controller;

import com.careerconnect.dto.ApiResponse;
import com.careerconnect.dto.SavedJobResponse;
import com.careerconnect.service.SavedJobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @GetMapping
    public ResponseEntity<List<SavedJobResponse>> getMySavedJobs() {
        List<SavedJobResponse> savedJobs = savedJobService.getMySavedJobs();
        return ResponseEntity.ok(savedJobs);
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJobResponse> saveJob(@PathVariable Long jobId) {
        SavedJobResponse response = savedJobService.saveJob(jobId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse> unsaveJob(@PathVariable Long jobId) {
        savedJobService.unsaveJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job removed from saved list"));
    }

    @GetMapping("/check/{jobId}")
    public ResponseEntity<Map<String, Boolean>> isJobSaved(@PathVariable Long jobId) {
        boolean isSaved = savedJobService.isJobSaved(jobId);
        return ResponseEntity.ok(Map.of("isSaved", isSaved));
    }
}
