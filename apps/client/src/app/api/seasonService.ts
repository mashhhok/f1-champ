import axios from 'axios';
import { SeasonChampion } from '../../components/season/types';
import { Race } from '../../components/races/types';

// The base URL for the API
const API_BASE_URL = 'http://localhost:4000/api';

// Service to fetch seasons and race data
export const seasonService = {
  // Get all season champions
  getSeasonChampions: async (): Promise<SeasonChampion[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v1/champions`);
      // Map the backend data to match the frontend interface
      return response.data.map((champion: any) => ({
        year: parseInt(champion.season),
        champion: `${champion.givenName} ${champion.familyName}`
      }));
    } catch (error) {
      console.error('Error fetching season champions:', error);
      throw error;
    }
  },

  // Get race winners for a specific season
  getRaceWinners: async (season: number): Promise<Race[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v1/${season}/race-winners`);
      // Map the backend data to match the frontend interface
      return response.data.map((driver: any) => {
        return driver.race.map((race: any) => ({
          id: `${driver.driverId}-${race.raceName}`,
          grandPrix: race.raceName,
          wikipediaUrl: race.raceUrl,
          winner: `${driver.givenName} ${driver.familyName}`,
          team: driver.teamName,
          teamWikipediaUrl: driver.teamUrl,
          date: driver.raceDate,
          laps: driver.laps,
          time: driver.time
        }));
      }).flat();
    } catch (error) {
      console.error(`Error fetching race winners for season ${season}:`, error);
      throw error;
    }
  }
}; 
