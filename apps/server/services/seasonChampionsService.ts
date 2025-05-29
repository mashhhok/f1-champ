import { F1ApiResponse, DriverStanding } from "../controllers/types";
import { redisClient } from "../utils/redisClient";
import { fetchWithRetry } from "../utils/fetchRetryFunction";
import SeasonWinner, { ISeasonWinner } from "../models/seasonWinner";
import { SeasonDetailsService } from "./seasonDetailsService";
import { logger } from "../utils/logger";
import { environment } from "../config/environment";

export class SeasonChampionsService {
  private readonly logger = logger.child({ className: 'SeasonChampionsService' });
  async getSeasonChampions(): Promise<ISeasonWinner[]> {
    const currentYear = new Date().getFullYear();
    const startYear = environment.START_YEAR || 2005;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const championsMap: Record<string, ISeasonWinner> = {};

    const cachedChampions = await Promise.all(
      years.map(async (year) => {
        const cached = await redisClient.get(`season:${year}`);
        return cached ? JSON.parse(cached) as ISeasonWinner : null;
      })
    );

    cachedChampions.forEach((champion) => {
      if (champion) championsMap[champion.season] = champion;
    });

    let missingYears = years.filter((year) => !championsMap[year.toString()]);

    if (missingYears.length > 0) {
      const fromDb = await SeasonWinner.find({
        season: { $in: missingYears.map((y) => y.toString()) },
      }).lean();

      fromDb.forEach((champion) => {
        championsMap[champion.season] = champion;
        redisClient.set(`season:${champion.season}`, JSON.stringify(champion)); // also set to Redis
      });

      const foundYears = new Set(fromDb.map((c) => c.season));
      missingYears = missingYears.filter((year) => !foundYears.has(year.toString()));
      
      // Also filter out years that have ended seasons (except current year)
      const currentYear = new Date().getFullYear();
      missingYears = missingYears.filter(year => {
        const yearData = championsMap[year.toString()];
        // Only re-fetch if: 1) No data exists, or 2) It's current year and season hasn't ended
        return !yearData || (year === currentYear && !yearData.isSeasonEnded);
      });
    }

    const results = [];
    for (const year of missingYears) {
      const champion = await this.fetchChampion(year);
      results.push(champion);
    }

    const newChampions = results.filter((item): item is ISeasonWinner => item !== null);

    if (newChampions.length > 0) {
      // Use create instead of insertMany to ensure proper document creation with timestamps
      const createdChampions = await SeasonWinner.create(newChampions);
      
      // Convert to plain objects and update our maps
      createdChampions.forEach((doc) => {
        const champion = doc.toObject();
        championsMap[champion.season] = champion;
        redisClient.setEx(`season:${champion.season}`, environment.CACHE_TTL || 3600, JSON.stringify(champion));
      });
    }

    const sorted = Object.values(championsMap).sort(
      (a, b) => parseInt(a.season) - parseInt(b.season)
    );

    return sorted;
  }

  private async fetchChampion(year: number): Promise<ISeasonWinner | null> {
    const url = `https://api.jolpi.ca/ergast/f1/${year}/driverstandings`;

    const data = await fetchWithRetry<F1ApiResponse>(url);
    if (!data) return null;

    const standings = data.MRData.StandingsTable.StandingsLists;
    if (!standings || standings.length === 0) return null;

    const currentYear = new Date().getFullYear();
    const latestRace = parseInt(data.MRData.StandingsTable.round);
    let isSeasonEnded = true;
    
    if (year === currentYear) {
      // Only fetch number of races for current year where season might be ongoing
      const seasonDetailsService = new SeasonDetailsService();
      const numberOfRaces = parseInt(await seasonDetailsService.getNumberOfRaces(year.toString()));
      isSeasonEnded = latestRace >= numberOfRaces;
      this.logger.info(`Season status check - year: ${year}, latestRace: ${latestRace}, numberOfRaces: ${numberOfRaces}, isSeasonEnded: ${isSeasonEnded}`);
    } else {
      // For historical data, the season is definitely ended
      this.logger.debug(`Historical season - assumed ended. Year: ${year}`);
    }

    const driver = standings[0].DriverStandings.find((d: DriverStanding) => d.position === "1");
    if (!driver) return null;

    return {
      season: year.toString(),
      givenName: isSeasonEnded ? driver.Driver.givenName : " ",
      familyName: isSeasonEnded ? driver.Driver.familyName : " ",
      isSeasonEnded: isSeasonEnded,
    };
  }
} 