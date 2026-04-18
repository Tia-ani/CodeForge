package com.codeforge.service;

import com.codeforge.dto.ProblemDetailDTO;
import com.codeforge.dto.ProblemSummaryDTO;
import com.codeforge.exception.ResourceNotFoundException;
import com.codeforge.model.Problem;
import com.codeforge.model.TestCase;
import com.codeforge.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Problem management.
 * Converts between entities and DTOs — separation of concerns.
 */
@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    /**
     * Returns lightweight summaries of all problems (for list views).
     */
    public List<ProblemSummaryDTO> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(p -> new ProblemSummaryDTO(
                        p.getProblemId(),
                        p.getTitle(),
                        p.getDifficulty(),
                        p.getTestCases() != null ? p.getTestCases().size() : 0
                ))
                .collect(Collectors.toList());
    }

    /**
     * Returns full problem detail including visible test cases (for IDE view).
     */
    public ProblemDetailDTO getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with ID: " + id));

        // Only return non-hidden test cases as examples
        List<ProblemDetailDTO.TestCaseDTO> examples = problem.getTestCases().stream()
                .filter(tc -> !tc.isHidden())
                .map(tc -> new ProblemDetailDTO.TestCaseDTO(tc.getInput(), tc.getExpectedOutput()))
                .collect(Collectors.toList());

        return new ProblemDetailDTO(
                problem.getProblemId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getDifficulty(),
                problem.getConstraints(),
                examples
        );
    }

    /**
     * Creates a new problem (Admin only).
     */
    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    /**
     * Updates an existing problem (Admin only).
     */
    public Problem updateProblem(Long id, Problem updatedProblem) {
        Problem existing = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with ID: " + id));

        existing.setTitle(updatedProblem.getTitle());
        existing.setDescription(updatedProblem.getDescription());
        existing.setDifficulty(updatedProblem.getDifficulty());
        existing.setConstraints(updatedProblem.getConstraints());

        return problemRepository.save(existing);
    }

    /**
     * Deletes a problem by ID (Admin only).
     */
    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Problem not found with ID: " + id);
        }
        problemRepository.deleteById(id);
    }
}
