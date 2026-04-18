import { Submission, TestCase } from '../models';

export interface EvaluationResult {
  verdict: string;
  runtime: number; // in milliseconds
}

// Strategy Pattern for different language executors
export interface LanguageExecutor {
  execute(sourceCode: string, testCases: TestCase[]): Promise<EvaluationResult>;
}

// Mock Java Executor
export class JavaExecutor implements LanguageExecutor {
  async execute(sourceCode: string, testCases: TestCase[]): Promise<EvaluationResult> {
    // Simulated mock evaluation (In a real scenario, this connects to a Docker container)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ verdict: 'ACCEPTED', runtime: Math.random() * 100 + 50 });
      }, 500);
    });
  }
}

// Mock Python Executor
export class PythonExecutor implements LanguageExecutor {
  async execute(sourceCode: string, testCases: TestCase[]): Promise<EvaluationResult> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ verdict: 'ACCEPTED', runtime: Math.random() * 50 + 20 });
      }, 300);
    });
  }
}

// Mock Cpp Executor
export class CppExecutor implements LanguageExecutor {
  async execute(sourceCode: string, testCases: TestCase[]): Promise<EvaluationResult> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ verdict: 'ACCEPTED', runtime: Math.random() * 20 + 2 });
      }, 200);
    });
  }
}

// Factory Pattern to get the appropriate execution strategy
export class ExecutorFactory {
  static getExecutor(language: string): LanguageExecutor {
    switch (language.toLowerCase()) {
      case 'java':
        return new JavaExecutor();
      case 'python':
        return new PythonExecutor();
      case 'cpp':
        return new CppExecutor();
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}

// Singleton Pattern for Judge Engine (Handles Docker orchestration ideally)
export class JudgeEngine {
  private static instance: JudgeEngine;

  private constructor() {}

  public static getInstance(): JudgeEngine {
    if (!JudgeEngine.instance) {
      JudgeEngine.instance = new JudgeEngine();
    }
    return JudgeEngine.instance;
  }

  public async evaluateSubmission(submission: Submission, testCases: TestCase[]): Promise<EvaluationResult> {
    const executor = ExecutorFactory.getExecutor(submission.language);
    return await executor.execute(submission.code, testCases);
  }
}
