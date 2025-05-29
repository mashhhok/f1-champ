import { SeasonChampionsService } from "./seasonChampionsService";
import SeasonWinner from "../models/seasonWinner";
import { redisClient } from "../utils/redisClient";

export class StartupDataLoader {
  private seasonChampionsService: SeasonChampionsService;

  constructor() {
    this.seasonChampionsService = new SeasonChampionsService();
  }

  async loadAllData(): Promise<void> {
    console.log("🚀 Starting data initialization...");
    
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

      console.log(`📊 Found ${existingData.length}/${expectedYears.length} seasons in MongoDB`);

      // Check if current year data needs refresh (might be incomplete season)
      const currentYearData = existingData.find(d => d.season === currentYear.toString());
      const needsCurrentYearRefresh = !currentYearData || !currentYearData.isSeasonEnded;

      if (needsCurrentYearRefresh) {
        console.log(`🔄 Current year (${currentYear}) needs refresh - season may be ongoing`);
      }

      // Load Redis cache from MongoDB first
      await this.warmRedisCache(existingData);

      // If we're missing any data or need to refresh current year, fetch it
      if (existingData.length < expectedYears.length || needsCurrentYearRefresh) {
        console.log("🔄 Fetching missing or outdated data from external API...");
        
        // This will use the existing logic to fetch only missing years
        // and update both MongoDB and Redis
        await this.seasonChampionsService.getSeasonChampions();
        
        console.log("✅ Data sync completed");
      } else {
        console.log("✅ All data is up to date");
      }

      // Schedule periodic refresh for current season if it's not ended
      if (needsCurrentYearRefresh) {
        this.scheduleCurrentSeasonRefresh();
      }

    } catch (error) {
      console.error("❌ Error during startup data loading:", error);
      // Don't throw - allow server to start even if data loading fails
    }
  }

  private async warmRedisCache(data: any[]): Promise<void> {
    console.log(`🔥 Warming Redis cache with ${data.length} seasons...`);
    
    const promises = data.map(champion => 
      redisClient.set(`season:${champion.season}`, JSON.stringify(champion))
    );
    
    await Promise.all(promises);
    console.log("✅ Redis cache warmed");
  }

  private scheduleCurrentSeasonRefresh(): void {
    // Refresh current season data every hour
    const ONE_HOUR = 60 * 60 * 1000;
    
    setInterval(async () => {
      try {
        console.log("🔄 Refreshing current season data...");
        const currentYear = new Date().getFullYear();
        
        // Delete current year from MongoDB to force refresh
        await SeasonWinner.deleteOne({ season: currentYear.toString() });
        
        // Delete from Redis too
        await redisClient.del(`season:${currentYear}`);
        
        // Fetch fresh data
        await this.seasonChampionsService.getSeasonChampions();
        
        console.log("✅ Current season refresh completed");
      } catch (error) {
        console.error("❌ Error refreshing current season:", error);
      }
    }, ONE_HOUR);

    console.log("⏰ Scheduled hourly refresh for current season");
  }
}

export const startupDataLoader = new StartupDataLoader();