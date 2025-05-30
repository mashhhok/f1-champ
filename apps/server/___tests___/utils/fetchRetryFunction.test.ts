import axios from 'axios';
import { fetchWithRetry } from '../../utils/fetchRetryFunction';
import { apiRateLimiter } from '../../utils/rateLimiter';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('axios');
jest.mock('../../utils/rateLimiter');
jest.mock('../../utils/logger', () => ({
  logger: {
    child: jest.fn().mockReturnValue({
      warn: jest.fn(),
      error: jest.fn()
    })
  }
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockRateLimiter = apiRateLimiter as jest.Mocked<typeof apiRateLimiter>;

// Mock timers to avoid real delays
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('fetchWithRetry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    
    // Mock rate limiter methods
    mockRateLimiter.waitIfNeeded = jest.fn().mockResolvedValue(undefined);
    mockRateLimiter.onSuccessfulRequest = jest.fn();
    mockRateLimiter.onRateLimitHit = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return data on successful request', async () => {
    const mockData = { test: 'data' };
    mockAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchWithRetry('http://example.com');

    expect(result).toEqual(mockData);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith('http://example.com');
  });

  it('should retry on 429 rate limit error', async () => {
    const mockData = { test: 'data' };
    const rateLimitError = {
      response: { status: 429 },
      message: 'Rate limited'
    };

    mockAxios.get
      .mockRejectedValueOnce(rateLimitError)
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValueOnce({ data: mockData });

    const promise = fetchWithRetry('http://example.com');
    
    // Process all timers
    await jest.runAllTimersAsync();
    
    const result = await promise;

    expect(result).toEqual(mockData);
    expect(mockAxios.get).toHaveBeenCalledTimes(3);
    expect(mockRateLimiter.onRateLimitHit).toHaveBeenCalledTimes(2);
  }, 30000);

  it('should retry on general errors', async () => {
    const mockData = { test: 'data' };
    const generalError = {
      message: 'Network error'
    };

    mockAxios.get
      .mockRejectedValueOnce(generalError)
      .mockResolvedValueOnce({ data: mockData });

    const promise = fetchWithRetry('http://example.com');
    
    // Process all timers
    await jest.runAllTimersAsync();
    
    const result = await promise;

    expect(result).toEqual(mockData);
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  }, 30000);

  it('should return null after exhausting all retries', async () => {
    const error = {
      message: 'Persistent error'
    };

    mockAxios.get.mockRejectedValue(error);

    const promise = fetchWithRetry('http://example.com', 2);
    
    // Process all timers
    await jest.runAllTimersAsync();
    
    const result = await promise;

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(3); // Initial + 2 retries
  }, 30000);

  it('should use default retry count of 3', async () => {
    const error = {
      message: 'Error'
    };

    mockAxios.get.mockRejectedValue(error);

    const promise = fetchWithRetry('http://example.com');
    
    // Process all timers
    await jest.runAllTimersAsync();
    
    const result = await promise;

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(4); // Initial + 3 retries
  }, 30000);

  it('should handle 429 errors differently from other errors', async () => {
    const rateLimitError = {
      response: { status: 429 },
      message: 'Rate limited'
    };

    mockAxios.get.mockRejectedValue(rateLimitError);

    const promise = fetchWithRetry('http://example.com', 1);
    
    // Process all timers
    await jest.runAllTimersAsync();
    
    const result = await promise;

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(2); // Initial + 1 retry
    expect(mockRateLimiter.onRateLimitHit).toHaveBeenCalledTimes(1);
  }, 30000);

  it('should handle errors without response object', async () => {
    const error = {
      message: 'Network timeout'
    };

    mockAxios.get.mockRejectedValue(error);

    const result = await fetchWithRetry('http://example.com', 0);

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });
}); 