
package com.careerconnect.repository;

import com.careerconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByPostedByIdOrderByCreatedAtDesc(Long recruiterId);

    List<Job> findAllByOrderByCreatedAtDesc();

    @Query("""
        SELECT j FROM Job j
        WHERE (:status = '' OR LOWER(j.status) = LOWER(:status))
        AND (
            :keyword = '' OR
            LOWER(j.title) LIKE CONCAT('%', LOWER(:keyword), '%') OR
            LOWER(j.company.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR
            LOWER(j.location) LIKE CONCAT('%', LOWER(:keyword), '%') OR
            LOWER(j.skills) LIKE CONCAT('%', LOWER(:keyword), '%') OR
            LOWER(j.description) LIKE CONCAT('%', LOWER(:keyword), '%')
        )
        AND (
            :location = '' OR
            LOWER(j.location) LIKE CONCAT('%', LOWER(:location), '%')
        )
        AND (
            :jobType = '' OR LOWER(j.jobType) = LOWER(:jobType)
        )
        AND (
            :experienceLevel = '' OR
            LOWER(j.experienceLevel) = LOWER(:experienceLevel)
        )
        ORDER BY j.createdAt DESC
        """)
    List<Job> searchJobs(
        @Param("keyword") String keyword,
        @Param("location") String location,
        @Param("jobType") String jobType,
        @Param("experienceLevel") String experienceLevel,
        @Param("status") String status
    );
}
