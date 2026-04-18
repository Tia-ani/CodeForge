import { sequelize, DataTypes, Model } from '../config/database';

export class User extends Model {
  declare userId: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: string;
}

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USER',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
