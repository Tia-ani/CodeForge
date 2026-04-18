package com.codeforge.service;

import com.codeforge.model.Submission;

public interface LeaderboardObserver {
    void onSubmissionEvaluated(Submission submission);
}
