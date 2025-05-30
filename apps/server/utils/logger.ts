import winston from 'winston';
import path from 'path';
import { environment } from '../config/environment';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Custom format that includes file/class name
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      const { timestamp, level, message, fileName, className, ...args } = info;
      const context = className ? `[${className}]` : fileName ? `[${fileName}]` : '';
      const argsStr = Object.keys(args).length ? ` ${JSON.stringify(args)}` : '';
      return `${timestamp} ${level}: ${context} ${message}${argsStr}`;
    },
  ),
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: environment.NODE_ENV === 'production' ? productionFormat : format,
  }),
];

if (environment.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: productionFormat,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: productionFormat,
    })
  );
}

const baseLogger = winston.createLogger({
  level: environment.LOG_LEVEL || 'info',
  levels,
  transports,
});

// Helper function to get caller file name
function getCallerFile(): string {
  const originalFunc = Error.prepareStackTrace;
  let callerfile = '';
  try {
    const err = new Error();

    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };

    const stack = err.stack as any;
    const currentfile = stack.shift()?.getFileName();

    while (stack.length) {
      callerfile = stack.shift()?.getFileName();
      if (currentfile !== callerfile && callerfile && !callerfile.includes('node_modules')) {
        break;
      }
    }
  } catch (e) {
    // Handle error
  } finally {
    Error.prepareStackTrace = originalFunc;
  }

  if (callerfile) {
    // Get relative path from project root
    const projectRoot = path.resolve(__dirname, '../../../');
    return path.relative(projectRoot, callerfile);
  }
  return 'unknown';
}

// Enhanced logger with automatic file name detection
export const logger = {
  error: (message: string, meta?: any) => {
    const fileName = getCallerFile();
    baseLogger.error(message, { fileName, ...meta });
  },
  warn: (message: string, meta?: any) => {
    const fileName = getCallerFile();
    baseLogger.warn(message, { fileName, ...meta });
  },
  info: (message: string, meta?: any) => {
    const fileName = getCallerFile();
    baseLogger.info(message, { fileName, ...meta });
  },
  http: (message: string, meta?: any) => {
    const fileName = getCallerFile();
    baseLogger.http(message, { fileName, ...meta });
  },
  debug: (message: string, meta?: any) => {
    const fileName = getCallerFile();
    baseLogger.debug(message, { fileName, ...meta });
  },
  // Factory method to create a logger with a specific context
  child: (context: { fileName?: string; className?: string }) => {
    return {
      error: (message: string, meta?: any) => baseLogger.error(message, { ...context, ...meta }),
      warn: (message: string, meta?: any) => baseLogger.warn(message, { ...context, ...meta }),
      info: (message: string, meta?: any) => baseLogger.info(message, { ...context, ...meta }),
      http: (message: string, meta?: any) => baseLogger.http(message, { ...context, ...meta }),
      debug: (message: string, meta?: any) => baseLogger.debug(message, { ...context, ...meta }),
    };
  },
};

// Create a stream object for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};