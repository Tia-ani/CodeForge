package com.codeforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for problem list responses.
 * Lightweight projection — excludes full description and test cases for list views.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemSummaryDTO {
    private Long problemId;
    private String title;
    private String difficulty;
    private int testCaseCount;
}
