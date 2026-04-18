package com.codeforge.repository;

import com.codeforge.model.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {
    Optional<Leaderboard> findByUser_UserId(Long userId);
    List<Leaderboard> findAllByOrderByTotalScoreDesc();
}
