/**
 * Standardized DTO (Data Transfer Object) layer.
 * All API responses are wrapped in ApiResponse<T> for consistency.
 */

// ── Generic API Response Wrapper ───────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data, timestamp: new Date().toISOString() };
}

export function errorResponse(message: string): ApiResponse<null> {
  return { success: false, error: message, timestamp: new Date().toISOString() };
}

// ── Problem DTOs ───────────────────────────────────────────────
export interface ProblemListDTO {
  problemId: number;
  title: string;
  difficulty: string;
  tag: string;
  testCaseCount: number;
}

export interface ProblemDetailDTO {
  problemId: number;
  title: string;
  description: string;
  difficulty: string;
  tag: string;
  constraints: string;
  examples: { input: string; expectedOutput: string }[];
}

// ── Submission DTOs ────────────────────────────────────────────
export interface SubmissionResultDTO {
  submissionId: number;
  verdict: string;
  runtime: number;
  language: string;
  failedTestCase?: number;
  totalTestCases: number;
  passedTestCases: number;
  failedInput?: string;
  expectedOutput?: string;
  actualOutput?: string;
}

export interface SubmissionHistoryDTO {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  language: string;
  verdict: string;
  runtime: number;
  submittedAt: string;
}

// ── Tag Count DTO ──────────────────────────────────────────────
export interface TagCountDTO {
  tag: string;
  count: number;
}

// ── Leaderboard DTO ────────────────────────────────────────────
export interface LeaderboardEntryDTO {
  rank: number;
  userId: number;
  userName: string;
  totalScore: number;
  problemsSolved: number;
}

// ── Auth DTO ───────────────────────────────────────────────────
export interface AuthResponseDTO {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}
