import { User, Leaderboard } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970337336763979244226452948404D6351';

export class AuthService {
  public async register(name: string, email: string, pass: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordStr = pass || '';
    const hashedPassword = await bcrypt.hash(passwordStr, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'USER' });

    // Initialize leaderboard
    await Leaderboard.create({ userId: user.userId, totalScore: 0, problemsSolved: 0 });

    const token = jwt.sign({ userId: user.userId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    return {
      token,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  public async login(email: string, pass: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const passwordStr = pass || '';
    const valid = await bcrypt.compare(passwordStr, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.userId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    return {
      token,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
