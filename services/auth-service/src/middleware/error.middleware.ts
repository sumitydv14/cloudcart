import { Request, Response, NextFunction } from 'express';

interface ErrorPayload {
  message: string;
  details: any;
  stack?: string;
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const payload: ErrorPayload = {
    message: error.message || 'Internal Server Error',
    details: error.details ?? null,
  };

  if (process.env.NODE_ENV !== 'production') {
    payload['stack'] = error.stack;
  }

  res.status(statusCode).json(payload);
};
