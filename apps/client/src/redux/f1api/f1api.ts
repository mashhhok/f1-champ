import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SeasonChampion } from '../../components/season/types';
import { Race } from '../../components/races/types';

// Type for the backend champion response
interface ChampionResponse {
  season: string;
  givenName: string;
  familyName: string;
}

// Type for the backend race response (matches IDriver from backend)
interface RaceResponse {
  driverId: string;
  race: {
    raceName: string;
    raceUrl: string;
    raceDate: string;
  }[];
  season: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  permanentNumber: string;
  driverUrl: string;
  teamName: string;
  teamUrl: string;
  laps: string;
  time: string;
}

export const f1Api = createApi({
  reducerPath: 'f1',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  tagTypes: ['Seasons', 'Races'],
  endpoints: (builder) => ({
    getSeasons: builder.query<SeasonChampion[], void>({ 
      query: () => '/v1/champions',
      providesTags: ['Seasons'],
      transformResponse: (response: ChampionResponse[]) => {
        return response.map(champion => ({
          year: parseInt(champion.season),
          champion: `${champion.givenName} ${champion.familyName}`
        }));
      }
    }),
    getRaceWinners: builder.query<Race[], number>({
      query: (season) => `/v1/${season}/race-winners`,
      providesTags: ['Races'],
      transformResponse: (response: RaceResponse[]) => {
        return response.flatMap(driver => 
          driver.race.map(race => ({
            id: `${driver.driverId}-${race.raceName}`,
            grandPrix: race.raceName,
            wikipediaUrl: race.raceUrl,
            winner: `${driver.givenName} ${driver.familyName}`,
            team: driver.teamName,
            teamWikipediaUrl: driver.teamUrl,
            date: race.raceDate,
            laps: parseInt(driver.laps),
            time: driver.time,
            // Store additional driver info for modal
            driverId: driver.driverId,
            driverNationality: driver.nationality,
            driverDateOfBirth: driver.dateOfBirth,
            driverUrl: driver.driverUrl,
            permanentNumber: driver.permanentNumber
          }))
        );
      }
    }),
  }),
});

export const { useGetSeasonsQuery, useGetRaceWinnersQuery } = f1Api;