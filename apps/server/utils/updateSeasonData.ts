import cron from "node-cron";
import { RaceWinnersService } from "../services/raceWinnersService";


const service = new RaceWinnersService();

const currentYear = new Date().getFullYear();

export const scheduleSeasonRefresh = () => {

  cron.schedule("0 2 * * 1", async () => {

    try {
      await service.getRaceWinners(String(currentYear));

    } catch (error) {
      console.error(`${currentYear}:`, error);
    }
  });
};