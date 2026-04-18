import { Request, Response } from 'express';
import { ProblemService } from '../services/ProblemService';

const problemService = new ProblemService();

export class ProblemController {
  static async getAll(req: Request, res: Response) {
    try {
      const problems = await problemService.getAllProblems();
      res.json(problems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const problem = await problemService.getProblemById(Number(req.params.id));
      res.json(problem);
    } catch (error: any) {
      res.status(404).json({ error: 'Problem not found' });
    }
  }
}
