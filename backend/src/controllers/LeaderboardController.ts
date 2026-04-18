import { Request, Response } from 'express';
import { LeaderboardService } from '../services/LeaderboardService';

const leaderboardService = new LeaderboardService();

export class LeaderboardController {
  static async getAll(req: Request, res: Response) {
    try {
      const entries = await leaderboardService.getLeaderboard();
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
