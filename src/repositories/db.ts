import { Database } from 'node-sqlite3-wasm';
import { config } from '../config';

let db: Database;

export function getDb(): Database {
  if (!db) {
    db = new Database(config.dbPath);
  }
  return db;
}
