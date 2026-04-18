import { sequelize, DataTypes, Model } from '../config/database';
import { User } from './User';

export class Leaderboard extends Model {
  declare leaderboardId: number;
  declare userId: number;
  declare totalScore: number;
  declare problemsSolved: number;
  
  // Optional relations fields
  public user?: User;
}

Leaderboard.init(
  {
    leaderboardId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'userId',
      },
      onDelete: 'CASCADE',
    },
    totalScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    problemsSolved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'leaderboard',
    timestamps: true,
  }
);

User.hasOne(Leaderboard, { foreignKey: 'userId', as: 'leaderboard' });
Leaderboard.belongsTo(User, { foreignKey: 'userId', as: 'user' });
