import cron from "node-cron";
import { RaceWinnersService } from "../services/raceWinnersService";
import { logger } from "./logger";

const cronLogger = logger.child({ fileName: 'utils/updateSeasonData.ts' });
const service = new RaceWinnersService();

const currentYear = new Date().getFullYear();

export const scheduleSeasonRefresh = () => {

  cron.schedule("0 2 * * 1", async () => {

    try {
      await service.getRaceWinners(String(currentYear));

    } catch (error) {
      cronLogger.error(`Failed to refresh season data for ${currentYear}:`, error);
    }
  });
};