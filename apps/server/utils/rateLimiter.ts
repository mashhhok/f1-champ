import { logger } from './logger';

export class RateLimiter {
  private lastRequestTime = 0;
  private minDelayBetweenRequests = 2000; // Start with 2 seconds to be safe
  private consecutiveRateLimits = 0;
  private readonly maxDelay = 10000; // Max 10 seconds between requests
  private readonly minDelay = 1500; // Minimum 1.5 seconds between requests
  private readonly logger = logger.child({ className: 'RateLimiter' });
  
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minDelayBetweenRequests) {
      const waitTime = this.minDelayBetweenRequests - timeSinceLastRequest;
      this.logger.info(`Rate limiter: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  onRateLimitHit(): void {
    this.consecutiveRateLimits++;
    // Exponentially increase delay when hitting rate limits
    this.minDelayBetweenRequests = Math.min(
      this.minDelayBetweenRequests * 2,
      this.maxDelay
    );
    this.logger.warn(`Rate limit hit ${this.consecutiveRateLimits} times. Increasing delay to ${this.minDelayBetweenRequests}ms`);
  }
  
  onSuccessfulRequest(): void {
    if (this.consecutiveRateLimits > 0) {
      this.consecutiveRateLimits = 0;
      // Slowly decrease delay on successful requests
      this.minDelayBetweenRequests = Math.max(
        this.minDelay,
        this.minDelayBetweenRequests * 0.8
      );
      this.logger.info(`Successful request. Decreasing delay to ${this.minDelayBetweenRequests}ms`);
    }
  }
}

// Singleton instance for the entire app
export const apiRateLimiter = new RateLimiter();