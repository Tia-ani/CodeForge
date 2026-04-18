import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Submission, Problem, User, Leaderboard, TestCase } from '../models';
import { Op } from 'sequelize';

export class ProfileController {
  /**
   * GET /api/profile — returns full user profile with stats
   */
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Get leaderboard entry
      const lb = await Leaderboard.findOne({ where: { userId } });

      // Get all submissions for this user
      const allSubmissions = await Submission.findAll({
        where: { userId },
        include: [{ model: Problem, as: 'problem' }],
        order: [['submittedAt', 'DESC']],
      });

      // Accepted problem IDs (unique)
      const acceptedProblemIds = new Set<number>();
      const attemptedProblemIds = new Set<number>();

      for (const s of allSubmissions) {
        attemptedProblemIds.add(s.problemId);
        if (s.verdict === 'ACCEPTED') {
          acceptedProblemIds.add(s.problemId);
        }
      }

      // Count problems by difficulty
      const allProblems = await Problem.findAll();
      const totalByDifficulty: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
      const solvedByDifficulty: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };

      for (const p of allProblems) {
        if (totalByDifficulty[p.difficulty] !== undefined) {
          totalByDifficulty[p.difficulty]++;
        }
        if (acceptedProblemIds.has(p.problemId)) {
          if (solvedByDifficulty[p.difficulty] !== undefined) {
            solvedByDifficulty[p.difficulty]++;
          }
        }
      }

      // Build submission heatmap (last 12 months)
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const heatmapData: Record<string, number> = {};

      for (const s of allSubmissions) {
        const date = new Date((s as any).submittedAt).toISOString().split('T')[0];
        if (new Date(date) >= oneYearAgo) {
          heatmapData[date] = (heatmapData[date] || 0) + 1;
        }
      }

      // Recent accepted submissions
      const recentAccepted = allSubmissions
        .filter(s => s.verdict === 'ACCEPTED')
        .slice(0, 10)
        .map(s => ({
          problemId: s.problemId,
          problemTitle: (s as any).problem?.title || 'Unknown',
          language: s.language,
          submittedAt: (s as any).submittedAt,
        }));

      // Get global rank
      const allLeaderboard = await Leaderboard.findAll({ order: [['totalScore', 'DESC']] });
      let rank = 0;
      for (let i = 0; i < allLeaderboard.length; i++) {
        if (allLeaderboard[i].userId === userId) {
          rank = i + 1;
          break;
        }
      }

      // Compute languages used
      const languageCounts: Record<string, number> = {};
      for (const s of allSubmissions) {
        if (s.verdict === 'ACCEPTED') {
          languageCounts[s.language] = (languageCounts[s.language] || 0) + 1;
        }
      }

      res.json({
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        rank,
        totalSolved: acceptedProblemIds.size,
        totalAttempting: attemptedProblemIds.size - acceptedProblemIds.size,
        totalProblems: allProblems.length,
        totalScore: lb?.totalScore || 0,
        solvedByDifficulty,
        totalByDifficulty,
        totalSubmissions: allSubmissions.length,
        heatmapData,
        recentAccepted,
        languages: Object.entries(languageCounts).map(([lang, count]) => ({ language: lang, count })),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
