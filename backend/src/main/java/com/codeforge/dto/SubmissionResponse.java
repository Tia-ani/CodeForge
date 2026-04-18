package com.codeforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for submission responses returned to the frontend.
 * Prevents lazy-loading issues and circular references in JSON serialization.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {
    private Long submissionId;
    private Long problemId;
    private String problemTitle;
    private Long userId;
    private String userName;
    private String language;
    private String code;
    private String verdict;
    private Float runtime;
    private LocalDateTime submittedAt;
}
