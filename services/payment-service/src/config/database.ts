import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for payment service');
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
});


export const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();

    console.log('✅ Product Service connected to PostgreSQL');

    await sequelize.sync();

    console.log('✅ Product Service database synced');

  } catch (error) {
    console.error('❌ Product Service DB connection failed. Retrying in 5 seconds...');

    await new Promise((resolve) => setTimeout(resolve, 5000));

  }
};
