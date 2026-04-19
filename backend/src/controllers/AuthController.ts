import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { successResponse, errorResponse } from '../dtos/ApiResponse';

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.json(successResponse(result));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(successResponse(result));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }
}
