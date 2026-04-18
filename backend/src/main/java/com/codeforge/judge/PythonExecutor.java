package com.codeforge.judge;

import com.codeforge.model.TestCase;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class PythonExecutor implements LanguageExecutor {

    @Override
    public boolean compile(String code) {
        // Python is interpreted, so compile step generally just syntax checks if needed.
        return true;
    }

    @Override
    public EvaluationResult run(String code, List<TestCase> testCases) {
        // Mock Python execution
        float totalRuntime = 0;
        for (TestCase testCase : testCases) {
            totalRuntime += 0.02f;
        }
        return new EvaluationResult("ACCEPTED", totalRuntime);
    }
}
