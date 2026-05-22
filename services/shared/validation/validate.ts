import { AnyZodObject } from 'zod';
import { RequestHandler } from 'express';

export const validateBody = (schema: AnyZodObject): RequestHandler => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        issues: parsed.error.format(),
      });
    }

    req.body = parsed.data;
    next();
  };
};
