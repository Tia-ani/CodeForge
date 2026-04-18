package com.codeforge.judge;

import com.codeforge.model.TestCase;
import java.util.List;

public interface LanguageExecutor {
    boolean compile(String code);
    EvaluationResult run(String code, List<TestCase> testCases);
}
