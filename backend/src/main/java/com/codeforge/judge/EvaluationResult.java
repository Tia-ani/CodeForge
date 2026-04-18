package com.codeforge.judge;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EvaluationResult {
    private String verdict; // ACCEPTED, WRONG_ANSWER, TLE, COMPILATION_ERROR, RUNTIME_ERROR
    private float runtime;
}
