import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../repositories/db';
import { BookmarkException } from '../middleware/exceptions';

const router = Router();

router.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    getDb().all('SELECT 1');
    res.json({ db: 'ok' });
  } catch (err) {
    next(new BookmarkException('Database unavailable', 503));
  }
});

export default router;
