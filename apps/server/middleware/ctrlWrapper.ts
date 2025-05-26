import { Request, Response, NextFunction } from 'express';

/**
 * Wraps controller functions with try-catch for error handling
 * @param controller The controller function to wrap
 * @returns Wrapped controller with error handling
 */
export const ctrlWrapper = (
  controller: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
