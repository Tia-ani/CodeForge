package com.codeforge.controller;

import com.codeforge.model.Submission;
import com.codeforge.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submitCode(@RequestBody Submission submission) {
        Submission result = submissionService.processSubmission(submission);
        return ResponseEntity.ok(result);
    }
}
