import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Ensure we don't throw errors in the error handler itself
  try {
    let error = err;

    // Handle non-AppError errors
    if (!(error instanceof AppError)) {
      let statusCode = error.statusCode || error.status || 500;
      const message = error.message || 'Internal Server Error';
      
      // Special handling for CORS errors
      if (message.includes('CORS')) {
        statusCode = 403;
      }
      
      // Mark 4xx errors as operational (client errors)
      const isOperational = statusCode >= 400 && statusCode < 500;
      error = new AppError(message, statusCode, isOperational);
    }

    const appError = error as AppError;

    // Log error with defensive access to request properties
    try {
      logger.error(appError.message, {
        statusCode: appError.statusCode,
        code: appError.code,
        stack: appError.stack,
        url: req?.url || 'unknown',
        method: req?.method || 'unknown',
        ip: req?.ip || 'unknown',
        userAgent: req?.get?.('user-agent') || 'unknown',
      });
    } catch (logError) {
      // If logging fails, at least log to console
      console.error('Error logging failed:', logError);
      console.error('Original error:', appError.message);
    }

    // Send error response
    const response: any = {
      error: {
        message: appError.isOperational ? appError.message : 'Internal Server Error',
        code: appError.code,
        statusCode: appError.statusCode,
      }
    };

    // Add stack trace in development
    if (environment.NODE_ENV === 'development' && appError.stack) {
      response.error.stack = appError.stack;
    }

    // Ensure response hasn't been sent already
    if (!res.headersSent) {
      res.status(appError.statusCode).json(response);
    }
  } catch (handlerError) {
    // Last resort error handling
    console.error('Fatal error in error handler:', handlerError);
    if (!res.headersSent) {
      res.status(500).json({ error: { message: 'Internal Server Error' } });
    }
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any) => {
  logger.error('Unhandled Rejection:', { reason: reason?.message || reason });
  throw new AppError(reason?.message || 'Unhandled rejection', 500, false);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});