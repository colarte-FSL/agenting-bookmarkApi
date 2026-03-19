import { Request, Response, NextFunction } from 'express';
import { BadRequestException, BookmarkException, BookmarkNotFoundException } from './exceptions';

type KnownException = BadRequestException | BookmarkNotFoundException | BookmarkException;

function isKnownException(err: unknown): err is KnownException {
  return (
    err instanceof BadRequestException ||
    err instanceof BookmarkNotFoundException ||
    err instanceof BookmarkException
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (isKnownException(err)) {
    res.status(err.httpStatus).json({
      detail: err.message,
      httpStatus: err.httpStatus,
      errors: err.errors,
    });
    return;
  }

  res.status(500).json({
    detail: 'Internal server error',
    httpStatus: 500,
    errors: ['An unexpected error occurred'],
  });
}
