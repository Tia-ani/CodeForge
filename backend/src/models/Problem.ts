import { sequelize, DataTypes, Model } from '../config/database';

export class Problem extends Model {
  declare problemId: number;
  declare title: string;
  declare description: string;
  declare difficulty: string;
  declare constraints: string;
}

Problem.init(
  {
    problemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    constraints: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'problems',
    timestamps: true,
  }
);
