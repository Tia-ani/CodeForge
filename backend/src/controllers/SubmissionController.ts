import { Response } from 'express';
import { SubmissionService } from '../services/SubmissionService';
import { AuthRequest } from '../middlewares/auth';
import { successResponse, errorResponse, SubmissionResultDTO, SubmissionHistoryDTO } from '../dtos/ApiResponse';
import { Submission } from '../models';

const submissionService = new SubmissionService();

export class SubmissionController {
  /**
   * POST /api/submissions/run — run code with custom input (no submission saved)
   */
  static async runCode(req: AuthRequest, res: Response) {
    try {
      const { problemId, language, code, input } = req.body;
      const userId = req.user.userId;
      
      const result = await submissionService.runCodeWithInput(userId, problemId, language, code, input);

      const dto = {
        output: result.output,
        runtime: result.runtime,
        error: result.error,
      };

      res.json(successResponse(dto));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }

  /**
   * GET /api/submissions/:id/trace — get execution trace for a submission
   */
  static async getTrace(req: AuthRequest, res: Response) {
    try {
      const submissionId = Number(req.params.id);
      const userId = req.user.userId;

      // Verify submission belongs to user
      const submission = await Submission.findByPk(submissionId);
      if (!submission) {
        return res.status(404).json(errorResponse('Submission not found'));
      }

      if (submission.userId !== userId) {
        return res.status(403).json(errorResponse('Access denied'));
      }

      const trace = await submissionService.getSubmissionTrace(submissionId);

      if (!trace) {
        return res.status(404).json(errorResponse('No trace available for this submission'));
      }

      res.json(successResponse({
        submissionId,
        trace,
        totalSteps: trace.length,
      }));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message));
    }
  }

  /**
   * POST /api/submissions — submit code for judging
   */
  static async submit(req: AuthRequest, res: Response) {
    try {
      const { problemId, language, code } = req.body;
      const userId = req.user.userId;
      const result = await submissionService.processSubmission(userId, problemId, language, code);

      const dto: SubmissionResultDTO = {
        submissionId: result.submission.submissionId,
        verdict: result.submission.verdict,
        runtime: result.submission.runtime,
        language: result.submission.language,
        failedTestCase: result.failedTestCase,
        totalTestCases: result.totalTestCases,
        passedTestCases: result.passedTestCases,
        failedInput: result.failedInput,
        expectedOutput: result.expectedOutput,
        actualOutput: result.actualOutput,
      };

      res.json(successResponse(dto));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }

  /**
   * GET /api/submissions — user's submission history
   */
  static async getMySubmissions(req: AuthRequest, res: Response) {
    try {
      const submissions = await submissionService.getUserSubmissions(req.user.userId);
      const dtos: SubmissionHistoryDTO[] = submissions.map((s: any) => ({
        submissionId: s.submissionId,
        problemId: s.problemId,
        problemTitle: s.problem?.title || 'Unknown',
        language: s.language,
        verdict: s.verdict,
        runtime: s.runtime,
        submittedAt: s.submittedAt,
      }));
      res.json(successResponse(dtos));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message));
    }
  }

  /**
   * GET /api/submissions/problem/:problemId — submissions for a specific problem
   */
  static async getForProblem(req: AuthRequest, res: Response) {
    try {
      const submissions = await submissionService.getUserSubmissionsForProblem(
        req.user.userId,
        Number(req.params.problemId),
      );
      const dtos: SubmissionHistoryDTO[] = submissions.map((s: any) => ({
        submissionId: s.submissionId,
        problemId: s.problemId,
        problemTitle: s.problem?.title || 'Unknown',
        language: s.language,
        verdict: s.verdict,
        runtime: s.runtime,
        submittedAt: s.submittedAt,
      }));
      res.json(successResponse(dtos));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message));
    }
  }
}
