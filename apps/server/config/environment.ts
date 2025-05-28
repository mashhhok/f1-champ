import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
    NODE_ENV: string;
    PORT: number;
    DB_HOST: string;
    REDIS_URL: string;
}

function validateEnvironment(): EnvironmentConfig {
    const requiredVars = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT,
        DB_HOST: process.env.DB_HOST,
        REDIS_URL: process.env.REDIS_URL,
    };

    // Validate NODE_ENV
    const validNodeEnvs = ['development', 'production', 'test'];
    if (!validNodeEnvs.includes(requiredVars.NODE_ENV)) {
        throw new Error(`NODE_ENV must be one of: ${validNodeEnvs.join(', ')}`);
    }

    // Validate PORT
    const port = Number(requiredVars.PORT) || 4000;
    if (isNaN(port) || port <= 0 || port > 65535) {
        throw new Error('PORT must be a valid number between 1 and 65535');
    }

    // Validate DB_HOST
    if (!requiredVars.DB_HOST) {
        throw new Error('DB_HOST is required');
    }

    // Validate DB_HOST format (basic MongoDB URL validation)
    if (!requiredVars.DB_HOST.startsWith('mongodb://') && !requiredVars.DB_HOST.startsWith('mongodb+srv://')) {
        throw new Error('DB_HOST must be a valid MongoDB connection string');
    }

    // Set default Redis URL if not provided
    const redisUrl = requiredVars.REDIS_URL || 'redis://localhost:6379';

    // Validate Redis URL format
    if (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://')) {
        throw new Error('REDIS_URL must be a valid Redis connection string');
    }

    return {
        NODE_ENV: requiredVars.NODE_ENV,
        PORT: port,
        DB_HOST: requiredVars.DB_HOST,
        REDIS_URL: redisUrl,
    };
}

// Export validated configuration
export const config = validateEnvironment();

// Export individual values for convenience
export const {
    NODE_ENV,
    PORT,
    DB_HOST,
    REDIS_URL,
} = config; 