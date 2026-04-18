package com.codeforge.controller;

import com.codeforge.dto.LeaderboardDTO;
import com.codeforge.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Leaderboard Controller — public endpoint for viewing rankings.
 */
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    /**
     * GET /api/leaderboard — Returns the global leaderboard sorted by score.
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }
}
