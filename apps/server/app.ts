import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { environment } from "./config/environment";
import { driversRouter } from "./routes/drivers";
// import { setupSwagger } from "./swagger";
import { errorHandler } from "./middleware/errorHandler";
import { logger, morganStream } from "./utils/logger";

export const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: environment.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
  max: environment.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = environment.ALLOWED_ORIGINS || ['http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Create an error with a status property for proper handling
      const error: any = new Error('Not allowed by CORS');
      error.status = 403;
      callback(error);
    }
  },
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Body parsing with limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
app.use(morgan(environment.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: morganStream
}));

// Remove fingerprinting headers
app.disable('x-powered-by');

// Uncomment to enable Swagger in development
// if (environment.NODE_ENV === 'development') {
//   setupSwagger(app);
// }

// Health check endpoint for Railway
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: environment.NODE_ENV
    });
});

// API routes
app.use("/api", driversRouter);

// 404 handler
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: {
            message: "Not Found",
            path: req.url,
            method: req.method
        }
    });
});

// Error handling (must be last)
app.use(errorHandler);