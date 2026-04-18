import { Submission, Problem, TestCase, User } from '../models';
import { JudgeEngine } from './JudgeEngine';
import { LeaderboardObserver } from './LeaderboardObserver';
import { LeaderboardService } from './LeaderboardService';

export class SubmissionService {
  private observers: LeaderboardObserver[] = [];
  private judgeEngine: JudgeEngine;

  constructor() {
    this.judgeEngine = JudgeEngine.getInstance();
    
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

  public async processSubmission(userId: number, problemId: number, language: string, code: string) {
    const user = await User.findByPk(userId);
    const problem = await Problem.findByPk(problemId);

    if (!user || !problem) {
      throw new Error('User or Problem not found');
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

    // Evaluate
    const result = await this.judgeEngine.evaluateSubmission(submission, testCases);

    // Update submission
    submission.verdict = result.verdict;
    submission.runtime = result.runtime;
    await submission.save();

    // Notify observers
    await this.notifyObservers(submission);

    return submission;
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
}
