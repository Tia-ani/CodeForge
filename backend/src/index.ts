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

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/api', routes);

async function seedData() {
  const count = await Problem.count();
  if (count > 0) return;

  console.log("[DataSeeder] Initializing database...");

  // Seed default users
  const hashedPassword = await bcrypt.hash('user123', 10);
  const user = await User.create({ name: 'Anishka Khurana', email: 'anishka@codeforge.com', password: hashedPassword, role: 'USER' });
  await Leaderboard.create({ userId: user.userId, totalScore: 0, problemsSolved: 0 });

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@codeforge.com', password: adminPassword, role: 'ADMIN' });
  await Leaderboard.create({ userId: admin.userId, totalScore: 0, problemsSolved: 0 });

  // Seed 120 problems
  await seedProblems();
}

sequelize.sync({ force: true }).then(async () => {
  console.log('[DB] Database synced');
  await seedData();
  app.listen(PORT, () => {
    console.log(`[Server] CodeForge running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('[DB] Failed to sync:', err);
});
