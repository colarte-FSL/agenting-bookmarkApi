import { insertBookmark, BookmarkRow, CreateBookmarkData } from '../repositories/bookmarkRepository';

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function toBookmark(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description,
    tags: row.tags ? row.tags.split(',') : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createBookmark(data: CreateBookmarkData): Bookmark {
  const row = insertBookmark(data);
  return toBookmark(row);
}
