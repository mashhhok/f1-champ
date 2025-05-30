import { SeasonChampionsService } from "./seasonChampionsService";
import { RaceWinnersService } from "./raceWinnersService";
import SeasonWinner from "../models/seasonWinner";
import Driver from "../models/drivers";
import { redisClient } from "../utils/redisClient";
import { logger } from "../utils/logger";
import { environment } from "../config/environment";

export class StartupDataLoader {
  private seasonChampionsService: SeasonChampionsService;
  private raceWinnersService: RaceWinnersService;
  private refreshInterval?: NodeJS.Timeout;
  private isLoading = false;
  private readonly ONE_HOUR = 60 * 60 * 1000;

  constructor() {
    this.seasonChampionsService = new SeasonChampionsService();
    this.raceWinnersService = new RaceWinnersService();
  }

  async loadAllData(): Promise<void> {
    logger.info('🔄 Initializing data loading...');
    if (this.isLoading) {
      logger.warn('Data loading already in progress');
      return;
    }

    this.isLoading = true;
    logger.info('🚀 Starting data initialisation...');
    
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
        
        logger.info("✅ Season champions data sync completed");
      } else {
        logger.info("✅ All season champions data is up to date");
      }

      // Load race winners data for all seasons
      await this.loadRaceWinnersData(expectedYears);

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

  private async loadRaceWinnersData(expectedYears: string[]): Promise<void> {
    logger.info(`🏁 Loading race winners data for ${expectedYears.length} seasons...`);
    
    try {
      // Check what's already in MongoDB
      const existingSeasons = await Driver.distinct('season');
      const existingSeasonsSet = new Set(existingSeasons);
      
      // Find missing seasons
      const missingSeasonsForRaceWinners = expectedYears.filter(year => !existingSeasonsSet.has(year));
      
      if (missingSeasonsForRaceWinners.length === 0) {
        logger.info("✅ All race winners data is already loaded");
        
        // Warm Redis cache with existing data
        await this.warmRaceWinnersRedisCache(expectedYears);
        return;
      }
      
      logger.info(`🔄 Loading race winners for ${missingSeasonsForRaceWinners.length} missing seasons...`);
      
      // Load missing seasons in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < missingSeasonsForRaceWinners.length; i += batchSize) {
        const batch = missingSeasonsForRaceWinners.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (season) => {
            try {
              await this.raceWinnersService.getRaceWinners(season);
              logger.info(`✅ Loaded race winners for season ${season}`);
            } catch (error) {
              logger.error(`❌ Failed to load race winners for season ${season}:`, error);
            }
          })
        );
        
        // Small delay between batches to be nice to the API
        if (i + batchSize < missingSeasonsForRaceWinners.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      logger.info("✅ Race winners data loading completed");
    } catch (error) {
      logger.error("❌ Error loading race winners data:", error);
      // Don't throw - this is not critical for server startup
    }
  }

  private async warmRaceWinnersRedisCache(seasons: string[]): Promise<void> {
    logger.info(`🔥 Warming Redis cache with race winners for ${seasons.length} seasons...`);
    
    const promises = seasons.map(async (season) => {
      try {
        const cacheKey = `raceWinners:${season}`;
        const cached = await redisClient.get(cacheKey);
        
        if (!cached) {
          // Load from MongoDB and cache
          const drivers = await Driver.find({ season }).lean();
          if (drivers.length > 0) {
            await redisClient.setEx(cacheKey, environment.CACHE_TTL || 3600, JSON.stringify(drivers));
          }
        }
      } catch (error) {
        logger.error(`Failed to cache race winners for season ${season}:`, error);
      }
    });
    
    await Promise.all(promises);
    logger.info("✅ Race winners Redis cache warmed");
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
        const currentYearStr = currentYear.toString();
        
        // Delete current year champions from MongoDB to force refresh
        await SeasonWinner.deleteOne({ season: currentYearStr });
        
        // Delete current year race winners from MongoDB
        await Driver.deleteMany({ season: currentYearStr });
        
        // Delete from Redis too
        await redisClient.del(`season:${currentYear}`);
        await redisClient.del(`raceWinners:${currentYearStr}`);
        
        // Fetch fresh champions data
        await this.seasonChampionsService.getSeasonChampions();
        
        // Fetch fresh race winners data
        try {
          await this.raceWinnersService.getRaceWinners(currentYearStr);
          logger.info(`✅ Refreshed race winners for current season ${currentYearStr}`);
        } catch (error) {
          logger.error(`❌ Failed to refresh race winners for current season:`, error);
        }

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