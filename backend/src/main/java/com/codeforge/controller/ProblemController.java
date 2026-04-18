package com.codeforge.controller;

import com.codeforge.dto.ProblemDetailDTO;
import com.codeforge.dto.ProblemSummaryDTO;
import com.codeforge.model.Problem;
import com.codeforge.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Problem Controller — CRUD operations for coding problems.
 * GET endpoints are public; POST/PUT/DELETE require ADMIN role.
 */
@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    /**
     * GET /api/problems — Returns all problems (summary view).
     */
    @GetMapping
    public ResponseEntity<List<ProblemSummaryDTO>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    /**
     * GET /api/problems/{id} — Returns full problem details with examples.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProblemDetailDTO> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }

    /**
     * POST /api/problems — Create a new problem (Admin only).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        return ResponseEntity.ok(problemService.createProblem(problem));
    }

    /**
     * PUT /api/problems/{id} — Update a problem (Admin only).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody Problem problem) {
        return ResponseEntity.ok(problemService.updateProblem(id, problem));
    }

    /**
     * DELETE /api/problems/{id} — Delete a problem (Admin only).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }
}
