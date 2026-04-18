import { Problem, TestCase } from '../models';

export class ProblemService {
  public async getAllProblems() {
    const problems = await Problem.findAll({
      include: [{ model: TestCase, as: 'testCases' }]
    });

    return problems.map(p => ({
      problemId: p.problemId,
      title: p.title,
      difficulty: p.difficulty,
      testCaseCount: (p as any).testCases?.length || 0
    }));
  }

  public async getProblemById(id: number) {
    const problem = await Problem.findByPk(id, {
      include: [{ model: TestCase, as: 'testCases' }]
    });

    if (!problem) throw new Error('Problem not found');

    const examples = ((problem as any).testCases || [])
      .filter((tc: any) => !tc.isHidden)
      .map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }));

    return {
      problemId: problem.problemId,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      examples
    };
  }
}
