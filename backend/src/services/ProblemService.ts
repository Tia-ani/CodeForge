import { Problem, TestCase } from '../models';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import { ProblemListDTO, ProblemDetailDTO, TagCountDTO } from '../dtos/ApiResponse';

export class ProblemService {
  /**
   * Fetch all problems as a lightweight list.
   */
  public async getAllProblems(): Promise<ProblemListDTO[]> {
    const problems = await Problem.findAll({
      include: [{ model: TestCase, as: 'testCases' }],
    });

    return problems.map(p => ({
      problemId: p.problemId,
      title: p.title,
      difficulty: p.difficulty,
      tag: p.tag,
      testCaseCount: (p as any).testCases?.length || 0,
    }));
  }

  /**
   * Fetch a single problem by ID with visible examples.
   */
  public async getProblemById(id: number): Promise<ProblemDetailDTO> {
    const problem = await Problem.findByPk(id, {
      include: [{ model: TestCase, as: 'testCases' }],
    });

    if (!problem) throw new Error('Problem not found');

    const examples = ((problem as any).testCases || [])
      .filter((tc: any) => !tc.isHidden)
      .map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      }));

    return {
      problemId: problem.problemId,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tag: problem.tag,
      constraints: problem.constraints,
      examples,
    };
  }

  /**
   * Dynamic tag counts — SQL COUNT grouped by tag.
   * Replaces hardcoded frontend tag counts.
   */
  public async getTagCounts(): Promise<TagCountDTO[]> {
    const results = await sequelize.query<{ tag: string; count: number }>(
      `SELECT tag, COUNT(*) as count FROM problems GROUP BY tag ORDER BY count DESC`,
      { type: QueryTypes.SELECT },
    );

    return results.map(r => ({ tag: r.tag, count: Number(r.count) }));
  }
}
