package com.codeforge.judge;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExecutorFactory {

    @Autowired
    private JavaExecutor javaExecutor;

    @Autowired
    private PythonExecutor pythonExecutor;

    @Autowired
    private CppExecutor cppExecutor;

    public LanguageExecutor getExecutor(String language) {
        switch (language.toLowerCase()) {
            case "java":
                return javaExecutor;
            case "python":
                return pythonExecutor;
            case "cpp":
            case "c++":
                return cppExecutor;
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }
}
