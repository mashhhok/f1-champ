import { SeasonChampionsService } from "./seasonChampionsService";
import SeasonWinner from "../models/seasonWinner";
import { redisClient } from "../utils/redisClient";
import { logger } from "../utils/logger";
import { environment } from "../config/environment";

export class StartupDataLoader {
  private seasonChampionsService: SeasonChampionsService;
  private refreshInterval?: NodeJS.Timeout;
  private isLoading = false;
  private readonly ONE_HOUR = 60 * 60 * 1000;

  constructor() {
    this.seasonChampionsService = new SeasonChampionsService();
  }

  async loadAllData(): Promise<void> {
    if (this.isLoading) {
      logger.warn('Data loading already in progress');
      return;
    }

    this.isLoading = true;
    logger.info('🚀 Starting data initialization...');
    
    try {
      // Check current data state
      const currentYear = new Date().getFullYear();
      const startYear = 2005;
      const expectedYears = Array.from(
        { length: currentYear - startYear + 1 }, 
        (_, i) => (startYear + i).toString()
      );

      // Check what's in MongoDB
      const existingData = await SeasonWinner.find({
        season: { $in: expectedYears }
      }).lean();

      logger.info(`📊 Found ${existingData.length}/${expectedYears.length} seasons in MongoDB`);

      // Check if current year data needs refresh (might be incomplete season)
      const currentYearData = existingData.find(d => d.season === currentYear.toString());
      const needsCurrentYearRefresh = !currentYearData || !currentYearData.isSeasonEnded;

      if (needsCurrentYearRefresh) {
        logger.info(`🔄 Current year (${currentYear}) needs refresh - season may be ongoing`);
      }

      // Load Redis cache from MongoDB first
      await this.warmRedisCache(existingData);

      // If we're missing any data or need to refresh current year, fetch it
      if (existingData.length < expectedYears.length || needsCurrentYearRefresh) {
        logger.info("🔄 Fetching missing or outdated data from external API...");
        
        // This will use the existing logic to fetch only missing years
        // and update both MongoDB and Redis
        await this.seasonChampionsService.getSeasonChampions();
        
        logger.info("✅ Data sync completed");
      } else {
        logger.info("✅ All data is up to date");
      }

      // Schedule periodic refresh for current season if it's not ended
      if (needsCurrentYearRefresh) {
        this.scheduleCurrentSeasonRefresh();
      }

    } catch (error) {
      logger.error("❌ Error during startup data loading:", error);
      // Don't throw - allow server to start even if data loading fails
      // Retry after 5 minutes
      setTimeout(() => this.loadAllData(), 5 * 60 * 1000);
    } finally {
      this.isLoading = false;
    }
  }

  private async warmRedisCache(data: any[]): Promise<void> {
    logger.info(`🔥 Warming Redis cache with ${data.length} seasons...`);
    
    const promises = data.map(async (champion) => {
      try {
        await redisClient.setEx(`season:${champion.season}`, environment.CACHE_TTL || 3600, JSON.stringify(champion));
      } catch (error) {
        logger.error(`Failed to cache season ${champion.season}:`, error);
      }
    });
    
    await Promise.all(promises);
    logger.info("✅ Redis cache warmed");
  }

  private scheduleCurrentSeasonRefresh(): void {
    // Clear existing interval if any
    this.cleanup();
    
    // Refresh current season data every hour
    this.refreshInterval = setInterval(async () => {
      try {
        logger.info("🔄 Refreshing current season data...");
        const currentYear = new Date().getFullYear();
        
        // Delete current year from MongoDB to force refresh
        await SeasonWinner.deleteOne({ season: currentYear.toString() });
        
        // Delete from Redis too
        await redisClient.del(`season:${currentYear}`);
        
        // Fetch fresh data
        await this.seasonChampionsService.getSeasonChampions();

        logger.info("✅ Current season refresh completed");
      } catch (error) {
        logger.error("❌ Error refreshing current season:", error);
      }
    }, this.ONE_HOUR);

    logger.info("⏰ Scheduled hourly refresh for current season");
  }

  public cleanup(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
      logger.info('🧹 Cleaned up refresh interval');
    }
  }
}

// Export singleton instance
let instance: StartupDataLoader | null = null;

export const getStartupDataLoader = (): StartupDataLoader => {
  if (!instance) {
    instance = new StartupDataLoader();
  }
  return instance;
};

// For backward compatibility
export const startupDataLoader = getStartupDataLoader();

// Cleanup on process termination
process.on('SIGINT', () => {
  instance?.cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  instance?.cleanup();
  process.exit(0);
});