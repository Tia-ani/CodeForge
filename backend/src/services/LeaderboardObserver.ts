import { Submission } from '../models';

/**
 * Observer interface for the Observer Pattern.
 * Implemented by services that need to react to submission evaluations.
 */
export interface LeaderboardObserver {
  onSubmissionEvaluated(submission: Submission): Promise<void>;
}
