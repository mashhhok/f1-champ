import { ApiResponse, RaceResult } from "../controllers/types";
import Driver, { IDriver } from "../models/Drivers";
import { redisClient } from "../utils/redisClient";
import { fetchWithRetry } from "../utils/fetchRetryFunction";

export class RaceWinnersService {
  async getRaceWinners(season: string): Promise<IDriver[]> {
    const cacheKey = `raceWinners:${season}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as IDriver[];
    }

    const existingDrivers = await Driver.find({ season });
    if (existingDrivers.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(existingDrivers));
      return existingDrivers;
    }

    const baseUrl = `https://api.jolpi.ca/ergast/f1/${season}/results/`;
    const offsetIncrement = 30;
    const maxRequests = 5;
    const urls = Array.from({ length: maxRequests }, (_, i) =>
      i === 0 ? baseUrl : `${baseUrl}?offset=${i * offsetIncrement}`
    );

    const results = await Promise.all(
      urls.map((url) => fetchWithRetry<ApiResponse>(url))
    );

    const responseData = results.filter((r): r is ApiResponse => r !== null);

    const driverMap: Record<string, IDriver> = {};

    responseData.forEach((data) => {
      const races = data.MRData.RaceTable.Races;

      races.forEach((race: RaceResult) => {
        const winnerResult = race.Results.find((r) => r.position === "1");
        if (!winnerResult) return;

        const driver = winnerResult.Driver;
        const team = winnerResult.Constructor;
        const driverId = driver.driverId;

        if (!driverMap[driverId]) {
          driverMap[driverId] = {
            race: [
              {
                raceName: race.raceName,
                raceUrl: race.url,
                raceDate: race.date,
              },
            ],
            season: race.season,
            givenName: driver.givenName,
            familyName: driver.familyName,
            driverUrl: driver.url,
            dateOfBirth: driver.dateOfBirth,
            nationality: driver.nationality,
            permanentNumber: driver.permanentNumber,
            driverId: driver.driverId,
            teamName: team.name,
            teamUrl: team.url,
            laps: winnerResult.laps,
            time: winnerResult.Time?.time ?? null,
          };
        } else {
          driverMap[driverId].race?.push({
            raceName: race.raceName,
            raceUrl: race.url,
            raceDate: race.date,
          });
        }
      });
    });

    const driverArray = Object.values(driverMap);

    if (driverArray.length === 0) {
      throw new Error(`No race winners found for season ${season}`);
    }

    await Driver.insertMany(driverArray);
    await redisClient.set(cacheKey, JSON.stringify(driverArray));

    return driverArray;
  }
} 