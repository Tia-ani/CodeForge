package com.codeforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for leaderboard entries returned to the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardDTO {
    private int rank;
    private Long userId;
    private String userName;
    private int totalScore;
    private int problemsSolved;
}
