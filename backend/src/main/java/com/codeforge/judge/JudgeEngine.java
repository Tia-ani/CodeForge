package com.codeforge.judge;

import com.codeforge.model.Submission;
import com.codeforge.model.TestCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JudgeEngine {
    
    // Using Singleton Pattern: Spring @Service is a singleton by default
    
    @Autowired
    private ExecutorFactory executorFactory;

    public EvaluationResult evaluateSubmission(Submission submission, List<TestCase> testCases) {
        LanguageExecutor executor = executorFactory.getExecutor(submission.getLanguage());
        
        boolean compiled = executor.compile(submission.getCode());
        if (!compiled) {
            return new EvaluationResult("COMPILATION_ERROR", 0f);
        }

        return executor.run(submission.getCode(), testCases);
    }
}
