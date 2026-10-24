package com.careerconnect.repository;

import com.careerconnect.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantIdOrderByAppliedAtDesc(Long applicantId);

    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);

    @Query("SELECT a FROM Application a WHERE a.job.postedBy.id = :recruiterId ORDER BY a.appliedAt DESC")
    List<Application> findByRecruiterIdOrderByAppliedAtDesc(@Param("recruiterId") Long recruiterId);

    Optional<Application> findByJobIdAndApplicantId(Long jobId, Long applicantId);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
}
