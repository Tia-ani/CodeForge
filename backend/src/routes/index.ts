import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ProblemController } from '../controllers/ProblemController';
import { SubmissionController } from '../controllers/SubmissionController';
import { LeaderboardController } from '../controllers/LeaderboardController';
import { ProfileController } from '../controllers/ProfileController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Problems
router.get('/problems', ProblemController.getAll);
router.get('/problems/:id', ProblemController.getById);

// Submissions
router.post('/submissions', authenticateJWT, SubmissionController.submit);
router.get('/submissions', authenticateJWT, SubmissionController.getMySubmissions);
router.get('/submissions/problem/:problemId', authenticateJWT, SubmissionController.getForProblem);

// Leaderboard
router.get('/leaderboard', LeaderboardController.getAll);

// Profile
router.get('/profile', authenticateJWT, ProfileController.getProfile);

export default router;
