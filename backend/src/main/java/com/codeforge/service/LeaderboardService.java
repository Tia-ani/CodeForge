package com.codeforge.service;

import com.codeforge.model.Leaderboard;
import com.codeforge.model.Submission;
import com.codeforge.repository.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LeaderboardService implements LeaderboardObserver {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Override
    public void onSubmissionEvaluated(Submission submission) {
        if ("ACCEPTED".equals(submission.getVerdict())) {
            Optional<Leaderboard> leaderboardOpt = leaderboardRepository.findByUser_UserId(submission.getUser().getUserId());
            Leaderboard leaderboard = leaderboardOpt.orElseGet(() -> {
                Leaderboard lb = new Leaderboard();
                lb.setUser(submission.getUser());
                lb.setTotalScore(0);
                return lb;
            });
            
            // Add score on success (e.g., 10 points)
            leaderboard.setTotalScore(leaderboard.getTotalScore() + 10);
            leaderboardRepository.save(leaderboard);
        }
    }
}
