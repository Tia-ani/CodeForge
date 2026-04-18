import { Leaderboard, Submission, User, Problem } from '../models';
import { LeaderboardObserver } from './LeaderboardObserver';

export class LeaderboardService implements LeaderboardObserver {
  
  public async getLeaderboard() {
    const entries = await Leaderboard.findAll({
      order: [['totalScore', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['userId', 'name'] }]
    });

    return entries.map((entry, index) => {
      const json = entry.toJSON() as any;
      return {
        rank: index + 1,
        userId: entry.userId,
        userName: json.user?.name || `User ${entry.userId}`,
        totalScore: entry.totalScore,
        problemsSolved: entry.problemsSolved,
      };
    });
  }

  /**
   * Observer callback — triggered when a submission is evaluated.
   */
  public async onSubmissionEvaluated(submission: Submission): Promise<void> {
    if (submission.verdict === 'ACCEPTED') {
      const problem = await Problem.findByPk(submission.problemId);
      if (!problem) return;

      // Ensure we only award points once per problem
      const previousAcceptedCount = await Submission.count({
        where: {
          userId: submission.userId,
          problemId: submission.problemId,
          verdict: 'ACCEPTED'
        }
      });

      // If it's the first time it was accepted (count goes to >0 during query since it's already saved)
      if (previousAcceptedCount <= 1) {
        let entry = await Leaderboard.findOne({ where: { userId: submission.userId } });
        if (!entry) {
          entry = await Leaderboard.create({ userId: submission.userId, totalScore: 0, problemsSolved: 0 });
        }

        const points = this.getPointsForDifficulty(problem.difficulty);
        entry.totalScore += points;
        entry.problemsSolved += 1;
        await entry.save();
      }
    }
  }

  private getPointsForDifficulty(difficulty: string): number {
    switch (difficulty.toUpperCase()) {
      case 'EASY': return 10;
      case 'MEDIUM': return 20;
      case 'HARD': return 40;
      default: return 10;
    }
  }
}
