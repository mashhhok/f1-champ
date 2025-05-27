import axios from 'axios';
import { fetchWithRetry } from '../../utils/fetchRetryFunction';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWithRetry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    const result = await fetchWithRetry('http://example.com');

    expect(result).toEqual(mockData);
    expect(mockAxios.get).toHaveBeenCalledTimes(3);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('should retry on general errors', async () => {
    const mockData = { test: 'data' };
    const generalError = {
      message: 'Network error'
    };

    mockAxios.get
      .mockRejectedValueOnce(generalError)
      .mockResolvedValueOnce({ data: mockData });

    const result = await fetchWithRetry('http://example.com');

    expect(result).toEqual(mockData);
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith('Failed to fetch http://example.com: Network error');
  });

  it('should return null after exhausting all retries', async () => {
    const error = {
      message: 'Persistent error'
    };

    mockAxios.get.mockRejectedValue(error);

    const result = await fetchWithRetry('http://example.com', 2);

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(3); // Initial + 2 retries
    expect(console.error).toHaveBeenCalledTimes(3);
  });

  it('should use default retry count of 3', async () => {
    const error = {
      message: 'Error'
    };

    mockAxios.get.mockRejectedValue(error);

    const result = await fetchWithRetry('http://example.com');

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(4); // Initial + 3 retries
  });

  it('should handle 429 errors differently from other errors', async () => {
    const rateLimitError = {
      response: { status: 429 },
      message: 'Rate limited'
    };

    mockAxios.get.mockRejectedValue(rateLimitError);

    const result = await fetchWithRetry('http://example.com', 1);

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(2); // Initial + 1 retry
    expect(console.warn).toHaveBeenCalledWith('Rate limited for http://example.com. Retrying (1 left)...');
  });

  it('should handle errors without response object', async () => {
    const error = {
      message: 'Network timeout'
    };

    mockAxios.get.mockRejectedValue(error);

    const result = await fetchWithRetry('http://example.com', 0);

    expect(result).toBeNull();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('Failed to fetch http://example.com: Network timeout');
  });
}); 