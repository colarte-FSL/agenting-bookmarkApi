import { getDb } from './db';

export function runMigrations(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       VARCHAR(100) NOT NULL,
      url         VARCHAR(200) NOT NULL,
      description VARCHAR(500),
      tags        VARCHAR(500),
      created_at  DATETIME DEFAULT (datetime('now')),
      updated_at  DATETIME DEFAULT (datetime('now'))
    );
  `);
  console.log('Database migrations completed');
}
