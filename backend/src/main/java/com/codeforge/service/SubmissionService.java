package com.codeforge.service;

import com.codeforge.dto.SubmissionRequest;
import com.codeforge.dto.SubmissionResponse;
import com.codeforge.exception.ResourceNotFoundException;
import com.codeforge.judge.EvaluationResult;
import com.codeforge.judge.JudgeEngine;
import com.codeforge.model.Problem;
import com.codeforge.model.Submission;
import com.codeforge.model.TestCase;
import com.codeforge.model.User;
import com.codeforge.repository.ProblemRepository;
import com.codeforge.repository.SubmissionRepository;
import com.codeforge.repository.TestCaseRepository;
import com.codeforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Submission Service — orchestrates the full submission workflow.
 * 1. Saves submission as PENDING
 * 2. Delegates to JudgeEngine for evaluation
 * 3. Updates verdict and runtime
 * 4. Notifies observers (Leaderboard) — Observer Pattern
 */
@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private JudgeEngine judgeEngine;

    @Autowired
    private LeaderboardService leaderboardService;

    // Observer Pattern — list of observers
    private final List<LeaderboardObserver> observers = new ArrayList<>();

    @PostConstruct
    public void init() {
        // Register the leaderboard service as an observer
        observers.add(leaderboardService);
    }

    /**
     * Processes a code submission end-to-end.
     * Follows the Sequence Diagram: save → evaluate → update → notify.
     */
    @Transactional
    public SubmissionResponse processSubmission(SubmissionRequest request, String userEmail) {
        // Resolve user and problem from their IDs
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with ID: " + request.getProblemId()));

        // Step 1: Save submission as PENDING
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setLanguage(request.getLanguage());
        submission.setCode(request.getCode());
        submission.setVerdict("PENDING");
        submission.setSubmittedAt(LocalDateTime.now());
        submission = submissionRepository.save(submission);

        // Step 2 & 3: JudgeEngine evaluates against all test cases
        List<TestCase> testCases = testCaseRepository.findByProblem_ProblemId(problem.getProblemId());
        EvaluationResult result = judgeEngine.evaluateSubmission(submission, testCases);

        // Step 4: Update verdict and runtime in database
        submission.setVerdict(result.getVerdict());
        submission.setRuntime(result.getRuntime());
        submission = submissionRepository.save(submission);

        // Step 5: Notify observers (Leaderboard update)
        notifyObservers(submission);

        return toResponse(submission);
    }

    /**
     * Returns all submissions for the authenticated user.
     */
    public List<SubmissionResponse> getUserSubmissions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return submissionRepository.findByUser_UserId(user.getUserId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns submissions for a specific problem by the authenticated user.
     */
    public List<SubmissionResponse> getUserSubmissionsForProblem(String userEmail, Long problemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return submissionRepository.findByUser_UserIdAndProblem_ProblemId(user.getUserId(), problemId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Observer Pattern — notify all registered observers.
     */
    private void notifyObservers(Submission submission) {
        for (LeaderboardObserver observer : observers) {
            observer.onSubmissionEvaluated(submission);
        }
    }

    /**
     * Converts Submission entity to SubmissionResponse DTO.
     */
    private SubmissionResponse toResponse(Submission submission) {
        return new SubmissionResponse(
                submission.getSubmissionId(),
                submission.getProblem().getProblemId(),
                submission.getProblem().getTitle(),
                submission.getUser().getUserId(),
                submission.getUser().getName(),
                submission.getLanguage(),
                submission.getCode(),
                submission.getVerdict(),
                submission.getRuntime(),
                submission.getSubmittedAt()
        );
    }
}
