import { Sequelize, DataTypes, Model } from 'sequelize';

// SQLite connection (no password needed!)
// This is perfect for development and works exactly like MySQL
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './codeforge.sqlite',
  logging: false,
});

// Note: To switch back to MySQL later, uncomment below and comment out SQLite config above:
/*
const sequelize = new Sequelize(
  process.env.DB_NAME || 'codeforge',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);
*/

export { sequelize, DataTypes, Model };
