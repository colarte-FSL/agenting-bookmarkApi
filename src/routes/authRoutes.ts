import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedException } from '../middleware/exceptions';

const router = Router();

// In-memory store for valid refresh tokens
const refreshTokenStore = new Set<string>();

router.post('/token', (_req: Request, res: Response) => {
  const accessToken = jwt.sign({}, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign({}, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  });

  refreshTokenStore.add(refreshToken);

  res.json({
    accessToken,
    refreshToken,
    expiresIn: config.jwtExpiresIn,
  });
});

router.post('/refresh', (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    return next(new UnauthorizedException('Refresh token is required'));
  }

  if (!refreshTokenStore.has(refreshToken)) {
    return next(new UnauthorizedException('Invalid or unknown refresh token'));
  }

  try {
    jwt.verify(refreshToken, config.jwtSecret);
    console.log('token successfully verified');
  } catch (err) {
    refreshTokenStore.delete(refreshToken);
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException('Refresh token expired'));
    }
    return next(new UnauthorizedException('Invalid refresh token'));
  }

  const accessToken = jwt.sign({}, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  res.json({ accessToken, expiresIn: config.jwtExpiresIn });
});

export default router;
