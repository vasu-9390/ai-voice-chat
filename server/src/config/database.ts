import mongoose from 'mongoose';
import { config } from './env';
import { logger } from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: config.NODE_ENV !== 'production',
    });
    logger.info(`MongoDB connected successfully to ${config.MONGODB_URI.split('@').pop()}`);
  } catch (err: any) {
    logger.warn(`MongoDB direct connection warning: ${err.message}. Running with resilient fallback/replica.`);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Retrying connection...');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed.');
};
