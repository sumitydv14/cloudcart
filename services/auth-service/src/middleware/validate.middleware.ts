import { RequestHandler } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return (req, res, next) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        issues: parseResult.error.format(),
      });
    }

    req.body = parseResult.data;
    return next();
  };
};
