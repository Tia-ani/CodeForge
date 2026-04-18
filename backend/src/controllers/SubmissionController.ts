import { Response } from 'express';
import { SubmissionService } from '../services/SubmissionService';
import { AuthRequest } from '../middlewares/auth';

const submissionService = new SubmissionService();

export class SubmissionController {
  static async submit(req: AuthRequest, res: Response) {
    try {
      const { problemId, language, code } = req.body;
      const userId = req.user.userId;
      const response = await submissionService.processSubmission(userId, problemId, language, code);
      
      res.json({
        submissionId: response.submissionId,
        verdict: response.verdict,
        runtime: response.runtime,
        language: response.language
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getMySubmissions(req: AuthRequest, res: Response) {
    try {
      const submissions = await submissionService.getUserSubmissions(req.user.userId);
      res.json(submissions.map((s: any) => ({
        submissionId: s.submissionId,
        problemId: s.problemId,
        problemTitle: s.problem?.title,
        language: s.language,
        verdict: s.verdict,
        runtime: s.runtime,
        submittedAt: s.submittedAt
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getForProblem(req: AuthRequest, res: Response) {
    try {
      const submissions = await submissionService.getUserSubmissionsForProblem(req.user.userId, Number(req.params.problemId));
      res.json(submissions.map((s: any) => ({
        submissionId: s.submissionId,
        problemId: s.problemId,
        problemTitle: s.problem?.title,
        language: s.language,
        verdict: s.verdict,
        runtime: s.runtime,
        submittedAt: s.submittedAt
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
