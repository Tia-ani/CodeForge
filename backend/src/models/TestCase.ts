import { sequelize, DataTypes, Model } from '../config/database';
import { Problem } from './Problem';

export class TestCase extends Model {
  declare testCaseId: number;
  declare problemId: number;
  declare input: string;
  declare expectedOutput: string;
  declare isHidden: boolean;
}

TestCase.init(
  {
    testCaseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Problem,
        key: 'problemId',
      },
      onDelete: 'CASCADE',
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expectedOutput: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'test_cases',
    timestamps: false,
  }
);

Problem.hasMany(TestCase, { foreignKey: 'problemId', as: 'testCases' });
TestCase.belongsTo(Problem, { foreignKey: 'problemId', as: 'problem' });
