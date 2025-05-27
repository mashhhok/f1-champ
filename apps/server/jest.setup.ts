// Mock Redis client
jest.mock('./utils/redisClient', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

// Mock Mongoose models
jest.mock('./models/drivers', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    insertMany: jest.fn(),
  },
}));

jest.mock('./models/seasonWinner', () => ({
  __esModule: true,
  default: {
    find: jest.fn().mockReturnValue({
      lean: jest.fn(),
    }),
    insertMany: jest.fn(),
  },
}));

// Mock Mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  set: jest.fn(),
  Schema: jest.fn(),
  model: jest.fn(),
}));

// Mock axios
jest.mock('axios');

// Set test environment variables
Object.defineProperty(process.env, 'NODE_ENV', { value: 'test' });
Object.defineProperty(process.env, 'DB_HOST', { value: 'mongodb://localhost:27017/test' });
Object.defineProperty(process.env, 'PORT', { value: '4001' }); 