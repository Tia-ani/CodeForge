package com.codeforge.judge;

import com.codeforge.model.TestCase;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class CppExecutor implements LanguageExecutor {

    @Override
    public boolean compile(String code) {
        // Mock C++ Compilation via g++
        return true;
    }

    @Override
    public EvaluationResult run(String code, List<TestCase> testCases) {
        // Mock C++ Execution
        float totalRuntime = 0;
        for (TestCase testCase : testCases) {
            totalRuntime += 0.01f;
        }
        return new EvaluationResult("ACCEPTED", totalRuntime);
    }
}
