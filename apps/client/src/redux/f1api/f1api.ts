import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  SeasonChampion, 
  Race, 
  ChampionResponse,
  RaceWinnerResponse 
} from '@f1-champ/shared-types';
import getConfig from 'next/config';

// Get runtime configuration
const { publicRuntimeConfig } = getConfig() || {};
const API_BASE_URL = publicRuntimeConfig?.apiUrl || process.env.NEXT_PUBLIC_API_URL;

// Add type mapper for RaceWinnerResponse to Race[]
const mapRaceResponseToRace = (response: RaceWinnerResponse): Race[] => {
  return response.races.map(race => ({
    id: `${response.driverId}-${race.raceName}`,
    grandPrix: race.raceName ?? '',
    wikipediaUrl: race.raceUrl ?? '',
    date: race.raceDate ?? '',
    winner: `${response.givenName ?? ''} ${response.familyName ?? ''}`.trim(),
    driverId: response.driverId ?? '',
    driverNationality: response.nationality ?? '',
    driverDateOfBirth: response.dateOfBirth ?? '',
    driverUrl: response.wikipediaUrl ?? '',
    permanentNumber: response.permanentNumber ?? '',
    team: race.teamName ?? '',
    teamWikipediaUrl: race.teamUrl ?? '',
    laps: race.laps ?? '0',
    time: race.time ?? ''
  }));
};

export const f1Api = createApi({
  reducerPath: 'f1',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/api` }),
  tagTypes: ['Seasons', 'Races'],
  endpoints: (builder) => ({
    getSeasons: builder.query<SeasonChampion[], void>({ 
      query: () => '/v1/champions',
      providesTags: ['Seasons'],
      transformResponse: (response: ChampionResponse[]) => {
        return response.map(champion => ({
          year: champion.year,
          champion: champion.champion,
          isSeasonEnded: champion.isSeasonEnded
        }));
      }
    }),
    getRaceWinners: builder.query<Race[], number>({
      query: (season) => `/v1/${season}/race-winners`,
      providesTags: ['Races'],
      transformResponse: (response: RaceWinnerResponse[]) => {
        const races = response.flatMap(driver => mapRaceResponseToRace(driver));
        
        // Sort races by date (chronological order) at API level for production
        return races.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
      }
    }),
  }),
});

export const { useGetSeasonsQuery, useGetRaceWinnersQuery } = f1Api;