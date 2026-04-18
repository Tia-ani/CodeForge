package com.codeforge.service;

import com.codeforge.dto.LeaderboardDTO;
import com.codeforge.model.Leaderboard;
import com.codeforge.model.Submission;
import com.codeforge.repository.LeaderboardRepository;
import com.codeforge.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Leaderboard Service — implements Observable Pattern.
 * Automatically updates scores when notified of a successful submission.
 * Demonstrates Polymorphism: implements LeaderboardObserver interface.
 */
@Service
public class LeaderboardService implements LeaderboardObserver {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    /**
     * Observer callback — triggered when a submission is evaluated.
     * Awards points based on problem difficulty for ACCEPTED verdicts.
     */
    @Override
    @Transactional
    public void onSubmissionEvaluated(Submission submission) {
        if ("ACCEPTED".equals(submission.getVerdict())) {
            // Check if user already solved this problem (avoid duplicate scoring)
            List<Submission> previousAccepted = submissionRepository
                    .findByUser_UserIdAndProblem_ProblemIdAndVerdict(
                            submission.getUser().getUserId(),
                            submission.getProblem().getProblemId(),
                            "ACCEPTED"
                    );

            // Only award points for FIRST accepted solution to this problem
            if (previousAccepted.size() <= 1) {
                Optional<Leaderboard> leaderboardOpt = leaderboardRepository
                        .findByUser_UserId(submission.getUser().getUserId());

                Leaderboard leaderboard = leaderboardOpt.orElseGet(() -> {
                    Leaderboard lb = new Leaderboard();
                    lb.setUser(submission.getUser());
                    lb.setTotalScore(0);
                    lb.setProblemsSolved(0);
                    return lb;
                });

                // Score based on difficulty
                int points = getPointsForDifficulty(submission.getProblem().getDifficulty());
                leaderboard.setTotalScore(leaderboard.getTotalScore() + points);
                leaderboard.setProblemsSolved(leaderboard.getProblemsSolved() + 1);

                leaderboardRepository.save(leaderboard);
            }
        }
    }

    /**
     * Returns scored points based on problem difficulty.
     */
    private int getPointsForDifficulty(String difficulty) {
        return switch (difficulty.toUpperCase()) {
            case "EASY" -> 10;
            case "MEDIUM" -> 20;
            case "HARD" -> 40;
            default -> 10;
        };
    }

    /**
     * Returns the full leaderboard sorted by score, with computed ranks.
     */
    public List<LeaderboardDTO> getLeaderboard() {
        List<Leaderboard> entries = leaderboardRepository.findAllByOrderByTotalScoreDesc();
        AtomicInteger rankCounter = new AtomicInteger(1);

        return entries.stream()
                .map(entry -> new LeaderboardDTO(
                        rankCounter.getAndIncrement(),
                        entry.getUser().getUserId(),
                        entry.getUser().getName(),
                        entry.getTotalScore(),
                        entry.getProblemsSolved()
                ))
                .collect(Collectors.toList());
    }
}
