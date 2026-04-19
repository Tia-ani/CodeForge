import { Request, Response } from 'express';
import { ProblemService } from '../services/ProblemService';
import { successResponse, errorResponse } from '../dtos/ApiResponse';

const problemService = new ProblemService();

export class ProblemController {
  /**
   * GET /api/problems — list all problems
   */
  static async getAll(req: Request, res: Response) {
    try {
      const problems = await problemService.getAllProblems();
      res.json(successResponse(problems));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message));
    }
  }

  /**
   * GET /api/problems/:id — single problem detail
   */
  static async getById(req: Request, res: Response) {
    try {
      const problem = await problemService.getProblemById(Number(req.params.id));
      res.json(successResponse(problem));
    } catch (error: any) {
      res.status(404).json(errorResponse('Problem not found'));
    }
  }

  /**
   * GET /api/problems/tags — dynamic tag counts from DB
   */
  static async getTagCounts(req: Request, res: Response) {
    try {
      const tags = await problemService.getTagCounts();
      res.json(successResponse(tags));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message));
    }
  }
}
