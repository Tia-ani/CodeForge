package com.codeforge.controller;

import com.codeforge.model.Problem;
import com.codeforge.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemRepository problemRepository;

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Problem> addProblem(@RequestBody Problem problem) {
        return ResponseEntity.ok(problemRepository.save(problem));
    }
}
