package com.codeforge.controller;

import com.codeforge.dto.SubmissionRequest;
import com.codeforge.dto.SubmissionResponse;
import com.codeforge.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Submission Controller — handles code submission and history retrieval.
 * All endpoints require authentication (JWT).
 */
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    /**
     * POST /api/submissions — Submit code for evaluation.
     * The authenticated user's email is extracted from the JWT.
     */
    @PostMapping
    public ResponseEntity<SubmissionResponse> submitCode(
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        SubmissionResponse response = submissionService.processSubmission(request, userEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/submissions — Get all submissions for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(submissionService.getUserSubmissions(userEmail));
    }

    /**
     * GET /api/submissions/problem/{problemId} — Get user's submissions for a specific problem.
     */
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<SubmissionResponse>> getMySubmissionsForProblem(
            @PathVariable Long problemId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(submissionService.getUserSubmissionsForProblem(userEmail, problemId));
    }
}
