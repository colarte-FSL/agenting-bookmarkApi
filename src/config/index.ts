import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ?? '3000',
  dbPath: process.env.DB_PATH ?? './bookmarks.db',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
};
