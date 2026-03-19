import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createBookmark, listBookmarks, getBookmarkById } from '../services/bookmarkService';
import { BadRequestException } from '../middleware/exceptions';

const router = Router();

const createBookmarkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

router.get('/', (req: Request, res: Response) => {
  const tag = typeof req.query['tag'] === 'string' ? req.query['tag'] : undefined;
  const bookmarks = listBookmarks(tag);
  res.json(bookmarks);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params['id']);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new BadRequestException('id must be a positive integer'));
  }
  const bookmark = getBookmarkById(id);
  res.json(bookmark);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const result = createBookmarkSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    return next(new BadRequestException(errors));
  }

  const bookmark = createBookmark(result.data);
  res.status(201).json(bookmark);
});

export default router;
