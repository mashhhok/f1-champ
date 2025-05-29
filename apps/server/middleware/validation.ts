import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Schema definitions
const seasonSchema = z.string().regex(/^\d{4}$/).transform(val => {
  const year = parseInt(val);
  if (year < 2005 || year > new Date().getFullYear() + 1) {
    throw new Error('Invalid season year');
  }
  return year;
});

// Validation middleware factory
export const validateSeason = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Just validate without modifying the request object
    seasonSchema.parse(req.params.season);
    next();
  } catch (error) {
    res.status(400).json({ 
      error: 'Invalid season parameter',
      message: 'Season must be a valid year between 1950 and current year + 1'
    });
  }
};

// Generic validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        next(error);
      }
    }
  };
};