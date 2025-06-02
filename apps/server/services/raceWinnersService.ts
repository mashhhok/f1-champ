import { F1ApiResponse, RaceResult } from '@f1-champ/shared-types';
import Driver, { IDriver } from "../models/drivers";
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

    const winnersUrl = `https://api.jolpi.ca/ergast/f1/${season}/results/1/`;
    
    const response = await fetchWithRetry<F1ApiResponse>(winnersUrl);
    if (!response?.MRData?.RaceTable?.Races) {
      throw new Error(`Failed to fetch race winners for season ${season}`);
    }

    const races = response.MRData.RaceTable.Races;
    const driverMap: Record<string, IDriver> = {};

    races.forEach((race: RaceResult) => {
      const winnerResult = race.Results[0];
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
          driverUrl: driver.url ?? '',
          dateOfBirth: driver.dateOfBirth,
          nationality: driver.nationality,
          permanentNumber: driver.permanentNumber ?? '',
          driverId: driver.driverId,
          teamName: team.name,
          teamUrl: team.url ?? '',
          laps: winnerResult.laps,
          time: winnerResult.Time?.time ?? '',
        };
      } else {
        // Driver has won multiple races in this season
        driverMap[driverId].race?.push({
          raceName: race.raceName,
          raceUrl: race.url,
          raceDate: race.date,
        });
      }
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