import { Submission, Problem, TestCase, User, SubmissionTrace } from '../models';
import { JudgeEngine, EvaluationResult, ExecutorFactory } from './JudgeEngine';
import { LeaderboardObserver } from './LeaderboardObserver';
import { LeaderboardService } from './LeaderboardService';
import { ExecutionTracer } from './ExecutionTracer';
import { TraceStep } from '../models/SubmissionTrace';

export class SubmissionService {
  private observers: LeaderboardObserver[] = [];
  private judgeEngine: JudgeEngine;
  private executionTracer: ExecutionTracer;

  constructor() {
    this.judgeEngine = JudgeEngine.getInstance();
    this.executionTracer = new ExecutionTracer();
    
    // Register Observer manually for simplicity
    const leaderboardService = new LeaderboardService();
    this.addObserver(leaderboardService);
  }

  public addObserver(observer: LeaderboardObserver) {
    this.observers.push(observer);
  }

  private async notifyObservers(submission: Submission) {
    for (const observer of this.observers) {
      await observer.onSubmissionEvaluated(submission);
    }
  }

  public async runCodeWithInput(userId: number, problemId: number, language: string, code: string, input: string) {
    // Note: We don't need to verify user/problem for custom test runs
    // The user is already authenticated via JWT middleware
    // We're just executing code with custom input, not validating against test cases

    // Create a temporary test case with the custom input
    const tempTestCase = {
      testCaseId: 0,
      problemId,
      input: input.trim(),
      expectedOutput: '', // We don't know the expected output for custom input
      isHidden: false,
    } as TestCase;

    try {
      // Get the executor for the language
      const executor = ExecutorFactory.getExecutor(language);
      
      // Run the code with the custom input
      const result = await executor.execute(code, [tempTestCase]);
      
      return {
        output: result.actualOutput || 'No output',
        runtime: result.runtime,
        error: result.verdict === 'RUNTIME_ERROR' || result.verdict === 'COMPILATION_ERROR' 
          ? result.actualOutput 
          : null,
      };
    } catch (error: any) {
      return {
        output: '',
        runtime: 0,
        error: error.message || 'Execution failed',
      };
    }
  }

  public async processSubmission(userId: number, problemId: number, language: string, code: string) {
    console.log('[DEBUG] processSubmission called with:', { userId, problemId, language });
    
    const user = await User.findByPk(userId);
    console.log('[DEBUG] User lookup result:', user ? `Found user ${user.userId}` : 'User not found');
    
    const problem = await Problem.findByPk(problemId);
    console.log('[DEBUG] Problem lookup result:', problem ? `Found problem ${problem.problemId}` : 'Problem not found');

    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }

    if (!problem) {
      throw new Error(`Problem not found with ID: ${problemId}`);
    }

    // Save as PENDING
    let submission = await Submission.create({
      userId,
      problemId,
      language,
      code,
      verdict: 'PENDING'
    });

    const testCases = await TestCase.findAll({ where: { problemId } });
    console.log('[DEBUG] Found test cases:', testCases.length);

    // Evaluate via JudgeEngine (Strategy Pattern)
    const result: EvaluationResult = await this.judgeEngine.evaluateSubmission(submission, testCases);

    // Update submission with verdict
    submission.verdict = result.verdict;
    submission.runtime = result.runtime;
    await submission.save();

    // Generate execution trace if submission failed (for Forge-Sight feature)
    if (result.verdict === 'WRONG_ANSWER' && result.failedTestCase && testCases.length > 0) {
      try {
        const failedTest = testCases[result.failedTestCase - 1];
        const traces = await this.executionTracer.traceExecution(language, code, failedTest.input);
        
        if (traces.length > 0) {
          await SubmissionTrace.create({
            submissionId: submission.submissionId,
            traceData: JSON.stringify(traces),
            totalSteps: traces.length,
            executionTime: result.runtime,
          });
        }
      } catch (traceError) {
        console.error('Failed to generate execution trace:', traceError);
        // Don't fail the submission if tracing fails
      }
    }

    // Notify observers (Leaderboard updates)
    await this.notifyObservers(submission);

    return {
      submission,
      failedTestCase: result.failedTestCase,
      totalTestCases: result.totalTestCases,
      passedTestCases: result.passedTestCases,
      failedInput: result.failedInput,
      expectedOutput: result.expectedOutput,
      actualOutput: result.actualOutput,
    };
  }

  public async getUserSubmissions(userId: number) {
    return await Submission.findAll({ 
      where: { userId },
      include: [{ model: Problem, as: 'problem', attributes: ['title'] }],
      order: [['submittedAt', 'DESC']]
    });
  }

  public async getUserSubmissionsForProblem(userId: number, problemId: number) {
    return await Submission.findAll({
      where: { userId, problemId },
      include: [{ model: Problem, as: 'problem', attributes: ['title'] }],
      order: [['submittedAt', 'DESC']]
    });
  }

  public async getSubmissionTrace(submissionId: number): Promise<TraceStep[] | null> {
    const trace = await SubmissionTrace.findOne({
      where: { submissionId },
    });

    if (!trace) {
      return null;
    }

    try {
      return JSON.parse(trace.traceData);
    } catch (err) {
      console.error('Failed to parse trace data:', err);
      return null;
    }
  }
}
