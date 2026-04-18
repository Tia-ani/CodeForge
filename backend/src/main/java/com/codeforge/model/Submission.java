package com.codeforge.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Submission entity — maps to the SUBMISSIONS table.
 * Records each code submission by a user for a problem.
 */
@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long submissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnoreProperties({"testCases", "hibernateLazyInitializer", "handler"})
    private Problem problem;

    @Column(nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(nullable = false)
    private String verdict; // PENDING, ACCEPTED, WRONG_ANSWER, TLE, COMPILATION_ERROR

    private Float runtime;

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
}
