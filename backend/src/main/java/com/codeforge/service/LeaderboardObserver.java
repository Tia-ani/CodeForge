package com.codeforge.service;

import com.codeforge.model.Submission;

/**
 * Observer interface for the Observer Pattern.
 * Implemented by services that need to react to submission evaluations.
 * Demonstrates Abstraction — defines a contract without implementation details.
 */
public interface LeaderboardObserver {

    /**
     * Called when a submission has been evaluated with a final verdict.
     * @param submission the evaluated submission
     */
    void onSubmissionEvaluated(Submission submission);
}
