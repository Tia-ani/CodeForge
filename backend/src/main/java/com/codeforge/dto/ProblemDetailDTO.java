package com.codeforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for full problem detail views (IDE page).
 * Includes description, constraints, examples, and visible test cases.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDetailDTO {
    private Long problemId;
    private String title;
    private String description;
    private String difficulty;
    private String constraints;
    private List<TestCaseDTO> examples;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCaseDTO {
        private String input;
        private String expectedOutput;
    }
}
