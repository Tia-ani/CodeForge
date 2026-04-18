package com.codeforge.service;

import com.codeforge.judge.EvaluationResult;
import com.codeforge.judge.JudgeEngine;
import com.codeforge.model.Submission;
import com.codeforge.model.TestCase;
import com.codeforge.repository.SubmissionRepository;
import com.codeforge.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private JudgeEngine judgeEngine;

    @Autowired
    private LeaderboardService leaderboardService;

    private final List<LeaderboardObserver> observers = new ArrayList<>();

    @PostConstruct
    public void init() {
        // Registering observer
        observers.add(leaderboardService);
    }

    public Submission processSubmission(Submission submission) {
        // 1. Save submission status as PENDING
        submission.setVerdict("PENDING");
        submissionRepository.save(submission);

        // Fetch Test Cases
        List<TestCase> testCases = testCaseRepository.findByProblem_ProblemId(submission.getProblem().getProblemId());

        // 2 & 3. JudgeEngine calls LanguageExecutor to compile and run against all TestCases
        EvaluationResult result = judgeEngine.evaluateSubmission(submission, testCases);

        // 4. Update the database with the final verdict and runtime
        submission.setVerdict(result.getVerdict());
        submission.setRuntime(result.getRuntime());
        submissionRepository.save(submission);

        // 5. Notify the Leaderboard service to update scores using Observer Pattern
        notifyObservers(submission);

        return submission;
    }

    private void notifyObservers(Submission submission) {
        for (LeaderboardObserver observer : observers) {
            observer.onSubmissionEvaluated(submission);
        }
    }
}
