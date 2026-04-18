package com.codeforge.repository;

import com.codeforge.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser_UserId(Long userId);
    List<Submission> findByProblem_ProblemId(Long problemId);
}
