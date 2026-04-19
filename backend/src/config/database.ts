import { Sequelize, DataTypes, Model } from 'sequelize';

// Use PostgreSQL in production (Render), SQLite in development
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './codeforge.sqlite',
      logging: false
    });

export { sequelize, DataTypes, Model };
