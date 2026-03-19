import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ?? '3000',
  dbPath: process.env.DB_PATH ?? './bookmarks.db',
};
