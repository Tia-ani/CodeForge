package com.codeforge.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Leaderboard entity — maps to the LEADERBOARD table.
 * One-to-one relationship with User.
 * Updated via Observer Pattern when submissions are evaluated.
 */
@Entity
@Table(name = "leaderboard")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaderboardId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Column(name = "problems_solved", nullable = false)
    private Integer problemsSolved = 0;
}
