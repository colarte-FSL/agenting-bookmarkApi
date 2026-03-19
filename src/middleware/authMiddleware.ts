import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedException } from './exceptions';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedException('Missing or malformed Authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    jwt.verify(token, config.jwtSecret);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException('Token expired'));
    }
    next(new UnauthorizedException('Invalid token'));
  }
}
