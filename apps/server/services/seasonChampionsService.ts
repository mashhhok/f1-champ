import axios from "axios";
import { F1ApiResponse } from "../controllers/types";
import SeasonWinner, { ISeasonWinner } from "../models/seasonWinner";
import { fetchWithRetry } from "../utils/fetchRetryFunction";
import { redisClient } from "../utils/redisClient";

export class SeasonChampionsService {
  async getSeasonChampions(): Promise<ISeasonWinner[]> {
    const currentYear = new Date().getFullYear();
    const startYear = 2005;
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

    const missingYears = years.filter((year) => !championsMap[year.toString()]);

    if (missingYears.length > 0) {
      const fromDb = await SeasonWinner.find({
        season: { $in: missingYears.map((y) => y.toString()) },
      }).lean();

      fromDb.forEach((champion) => {
        championsMap[champion.season] = champion;
        redisClient.set(`season:${champion.season}`, JSON.stringify(champion)); // also set to Redis
      });

      const foundYears = new Set(fromDb.map((c) => c.season));
      missingYears.filter((year) => !foundYears.has(year.toString()));
    }

    const results = await Promise.all(
      missingYears.map((year) => this.fetchChampion(year))
    );

    const newChampions = results.filter((item): item is ISeasonWinner => item !== null);

    if (newChampions.length > 0) {
      await SeasonWinner.insertMany(newChampions);
      newChampions.forEach((champion) => {
        championsMap[champion.season] = champion;
        redisClient.set(`season:${champion.season}`, JSON.stringify(champion));
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

    const driver = standings[0].DriverStandings.find((d) => d.position === "1");
    if (!driver) return null;

    return {
      season: year.toString(),
      givenName: driver.Driver.givenName,
      familyName: driver.Driver.familyName,
    };
  }
} 