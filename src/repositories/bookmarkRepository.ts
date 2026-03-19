import { getDb } from './db';

export interface BookmarkRow {
  id: number;
  title: string;
  url: string;
  description: string | null;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBookmarkData {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}

export function insertBookmark(data: CreateBookmarkData): BookmarkRow {
  const db = getDb();
  const tags = data.tags && data.tags.length > 0 ? data.tags.join(',') : null;

  const result = db.run(
    `INSERT INTO bookmarks (title, url, description, tags)
     VALUES (:title, :url, :description, :tags)`,
    { ':title': data.title, ':url': data.url, ':description': data.description ?? null, ':tags': tags }
  );

  return db.all(
    'SELECT * FROM bookmarks WHERE id = :id',
    { ':id': result.lastInsertRowid }
  )[0] as unknown as BookmarkRow;
}
