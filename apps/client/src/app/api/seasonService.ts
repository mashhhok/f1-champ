import axios from 'axios';
import { SeasonChampion } from '../../components/season/types';
import { Race } from '../../components/races/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API response interfaces
interface ChampionApiResponse {
  season: string;
  givenName: string;
  familyName: string;
}

interface RaceApiResponse {
  raceName: string;
  raceUrl: string;
}

interface DriverApiResponse {
  driverId: string;
  givenName: string;
  familyName: string;
  teamName: string;
  teamUrl: string;
  raceDate: string;
  laps: number;
  time: string;
  race: RaceApiResponse[];
}

// Service to fetch seasons and race data
export const seasonService = {
  // Get all season champions
  getSeasonChampions: async (): Promise<SeasonChampion[]> => {
    console.log("API_BASE_URL is ", API_BASE_URL);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/champions`);
      // Map the backend data to match the frontend interface
      return response.data.map((champion: ChampionApiResponse) => ({
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
      const response = await axios.get(`${API_BASE_URL}/api/v1/${season}/race-winners`);
      // Map the backend data to match the frontend interface
      return response.data.map((driver: DriverApiResponse) => {
        return driver.race.map((race: RaceApiResponse) => ({
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
