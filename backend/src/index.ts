import express from 'express';
import cors from 'cors';
import routes from './routes';
import { sequelize } from './config/database';
import './models';
import { Problem, User, Leaderboard } from './models';
import { seedProblems } from './seeders/problemSeeder';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  // Add your Vercel domain after deployment
  // 'https://your-app.vercel.app'
];

// In production, allow any Vercel domain
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/\.vercel\.app$/);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/api', routes);

async function seedData() {
  const count = await Problem.count();
  if (count > 0) {
    console.log("[DataSeeder] Database already seeded, skipping...");
    return;
  }

  console.log("[DataSeeder] Initializing database...");

  // Seed default users
  const hashedPassword = await bcrypt.hash('user123', 10);
  const user = await User.create({ name: 'Anishka Khurana', email: 'anishka@codeforge.com', password: hashedPassword, role: 'USER' });
  await Leaderboard.create({ userId: user.userId, totalScore: 0, problemsSolved: 0 });
  console.log("[DataSeeder] Created user: anishka@codeforge.com");

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@codeforge.com', password: adminPassword, role: 'ADMIN' });
  await Leaderboard.create({ userId: admin.userId, totalScore: 0, problemsSolved: 0 });
  console.log("[DataSeeder] Created admin: admin@codeforge.com");

  // Seed 120 problems
  await seedProblems();
  console.log("[DataSeeder] ✅ Database seeding complete!");
}

sequelize.sync({ force: false, alter: true }).then(async () => {
  console.log('[DB] Database synced');
  await seedData();
  app.listen(PORT, () => {
    console.log(`[Server] CodeForge running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('[DB] Failed to sync:', err);
});
