package com.codeforge.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * TestCase entity — maps to the TEST_CASES table.
 * Each test case belongs to a Problem (many-to-one).
 */
@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testCaseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnoreProperties({"testCases", "hibernateLazyInitializer"})
    private Problem problem;

    @Column(columnDefinition = "TEXT")
    private String input;

    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "is_hidden")
    private boolean isHidden;
}
