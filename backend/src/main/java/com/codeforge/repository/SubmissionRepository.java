package com.codeforge.repository;

import com.codeforge.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for Submission entity.
 * Spring Data JPA generates implementations at runtime — Abstraction in action.
 */
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUser_UserId(Long userId);

    List<Submission> findByProblem_ProblemId(Long problemId);

    List<Submission> findByUser_UserIdAndProblem_ProblemId(Long userId, Long problemId);

    List<Submission> findByUser_UserIdAndProblem_ProblemIdAndVerdict(Long userId, Long problemId, String verdict);
}
