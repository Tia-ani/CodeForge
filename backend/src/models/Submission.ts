import { sequelize, DataTypes, Model } from '../config/database';
import { User } from './User';
import { Problem } from './Problem';

export class Submission extends Model {
  declare submissionId: number;
  declare userId: number;
  declare problemId: number;
  declare language: string;
  declare code: string;
  declare verdict: string;
  declare runtime: number;
}

Submission.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'userId',
      },
    },
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Problem,
        key: 'problemId',
      },
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    verdict: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PENDING',
    },
    runtime: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'submissions',
    timestamps: true,
    createdAt: 'submittedAt',
    updatedAt: false,
  }
);

User.hasMany(Submission, { foreignKey: 'userId', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Problem.hasMany(Submission, { foreignKey: 'problemId', as: 'submissions' });
Submission.belongsTo(Problem, { foreignKey: 'problemId', as: 'problem' });
