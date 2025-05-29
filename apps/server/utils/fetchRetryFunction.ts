import axios from 'axios';
import { apiRateLimiter } from './rateLimiter';

export async function fetchWithRetry<T>(url: string, retries = 3, initialRetries = 3): Promise<T | null> {
    const MAX_DELAY_429 = 30000; // Maximum 30 seconds for rate limit errors
    const MAX_DELAY_GENERAL = 8000; // Maximum 8 seconds for general errors
    
    try {
      // Wait if needed based on rate limiter
      await apiRateLimiter.waitIfNeeded();
      
      const response = await axios.get<T>(url);
      apiRateLimiter.onSuccessfulRequest();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        apiRateLimiter.onRateLimitHit();
        
        // Calculate exponential backoff: 5s, 10s, 20s...
        const attemptNumber = initialRetries - retries + 1;
        const baseDelay = Math.pow(2, attemptNumber) * 2500; // 5s, 10s, 20s...
        const jitter = Math.random() * 2000; // Add up to 2 seconds of random jitter
        const backoffDelay = Math.min(baseDelay + jitter, MAX_DELAY_429);
        
        console.warn(`Rate limited for ${url}. Retrying in ${Math.round(backoffDelay)}ms (attempt ${attemptNumber}/${initialRetries})...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return fetchWithRetry<T>(url, retries - 1, initialRetries);
      }
  
      console.error(`Failed to fetch ${url}: ${error.message}`);
      if (retries > 0) {
        const attemptNumber = initialRetries - retries + 1;
        const baseDelay = Math.pow(2, attemptNumber) * 500; // 1s, 2s, 4s...
        const jitter = Math.random() * 500; // Add up to 500ms of random jitter
        const delay = Math.min(baseDelay + jitter, MAX_DELAY_GENERAL);
        
        console.warn(`Retrying ${url} in ${Math.round(delay)}ms (attempt ${attemptNumber}/${initialRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry<T>(url, retries - 1, initialRetries);
      }
  
      return null;
    }
}