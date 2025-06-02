import { Driver, DriverStanding } from '../models/driver.js';
import { Race, RaceResult } from '../models/race.js';
import { SeasonChampion } from '../models/season.js';
import { Team } from '../models/team.js';

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type DriverResponse = ApiResponse<Driver>;
export type DriversResponse = PaginatedResponse<Driver>;
export type TeamResponse = ApiResponse<Team>;
export type RaceResponse = ApiResponse<Race>;
export type RacesResponse = PaginatedResponse<Race>;
export type SeasonChampionResponse = ApiResponse<SeasonChampion>;
export type SeasonChampionsResponse = ApiResponse<SeasonChampion[]>;

export interface F1ApiResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable?: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings: DriverStanding[];
      }>;
    };
    RaceTable?: {
      season: string;
      Races: RaceResult[];
    };
  };
}

export interface ChampionResponse {
  year: number;
  champion: string;
  isSeasonEnded: boolean;
}

export interface RaceWinnerResponse {
  driverId: string;
  givenName: string;
  familyName: string;
  permanentNumber?: string;
  dateOfBirth: string;
  nationality: string;
  wikipediaUrl?: string;
  races: Array<{
    raceName: string;
    raceUrl: string;
    raceDate: string;
    grandPrix: string;
    teamName: string;
    teamUrl?: string;
    driverName: string;
    driverUrl?: string;
    laps?: string;
    time?: string;
  }>;
}