import { Sequelize, DataTypes, Model } from 'sequelize';

// Using SQLite for zero-config relational database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './codeforge.sqlite',
  logging: false,
});

export { sequelize, DataTypes, Model };
