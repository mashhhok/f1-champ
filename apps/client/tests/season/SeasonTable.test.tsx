/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonTable from '../../src/components/season/SeasonTable';
import { SeasonChampion } from '../../src/components/season/types';
import { Race } from '../../src/components/races/types';

// Mock Material UI's useTheme hook
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...(originalModule as any),
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#ff0000' },
        secondary: { main: '#0000ff' },
        background: { paper: '#ffffff' },
        text: { primary: '#000000', secondary: '#333333' },
      },
    }),
  };
});

// Mock Redux hooks and API
const mockUpdateAllRaces = jest.fn();
const mockHandleSeasonClick = jest.fn();

jest.mock('../../src/redux/f1api/f1api', () => ({
  useGetSeasonsQuery: jest.fn(),
  useGetRaceWinnersQuery: jest.fn(),
}));

jest.mock('../../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    updateAllRaces: mockUpdateAllRaces,
  }),
}));

jest.mock('../../src/components/season/hooks/useSelectedYears', () => ({
  useSelectedYear: () => ({
    selectedYear: null,
    handleSeasonClick: mockHandleSeasonClick,
  }),
}));

// Mock child components
jest.mock('../../src/components/season/SeasonRow', () => {
  return {
    __esModule: true,
    default: ({ season, onClick }: { season: SeasonChampion; onClick: () => void }) => (
      <tr onClick={onClick} style={{ cursor: 'pointer' }}>
        <td>{season.year}</td>
        <td>{season.champion}</td>
      </tr>
    ),
  };
});

jest.mock('../../src/components/season/SeasonDetails', () => {
  return {
    __esModule: true,
    default: ({ year, races }: { year: number; races: Race[] }) => (
      <tr>
        <td colSpan={2}>
          <div>{year} Grand Prix Winners</div>
          {races.map(race => (
            <div key={race.id}>{race.grandPrix}</div>
          ))}
        </td>
      </tr>
    ),
  };
});

// Sample test data
const mockSeasons: SeasonChampion[] = [
  { year: 2023, champion: 'Max Verstappen' },
  { year: 2022, champion: 'Max Verstappen' },
];

const mockRaces: Race[] = [
  { 
    id: '2023-1',
    grandPrix: 'Bahrain Grand Prix', 
    winner: 'Max Verstappen',
    team: 'Red Bull',
    teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Red_Bull_Racing',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix',
    date: '2023-03-05',
    laps: 57,
    time: '1:33:56.736',
    driverId: 'max_verstappen',
    driverNationality: 'Dutch',
    driverDateOfBirth: '1997-09-30',
    driverUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
    permanentNumber: '1'
  },
  { 
    id: '2023-2',
    grandPrix: 'Saudi Arabian Grand Prix', 
    winner: 'Sergio Perez',
    team: 'Red Bull',
    teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Red_Bull_Racing',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/2023_Saudi_Arabian_Grand_Prix',
    date: '2023-03-19',
    laps: 50,
    time: '1:21:14.894',
    driverId: 'perez',
    driverNationality: 'Mexican',
    driverDateOfBirth: '1990-01-26',
    driverUrl: 'https://en.wikipedia.org/wiki/Sergio_P%C3%A9rez',
    permanentNumber: '11'
  },
];

describe('SeasonTable', () => {
  const { useGetSeasonsQuery, useGetRaceWinnersQuery } = require('../../src/redux/f1api/f1api');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    useGetSeasonsQuery.mockReturnValue({
      data: mockSeasons,
      isLoading: false,
      error: null,
    });
    
    useGetRaceWinnersQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });
  });

  it('renders the table with seasons when data is loaded', async () => {
    render(<SeasonTable />);

    // Check header
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();

    // Check seasons are displayed
    await waitFor(() => {
      expect(screen.getByText('2023')).toBeInTheDocument();
      expect(screen.getByText('2022')).toBeInTheDocument();
      expect(screen.getAllByText('Max Verstappen')).toHaveLength(2);
    });
  });

  it('shows loading state when seasons are loading', () => {
    useGetSeasonsQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<SeasonTable />);
    
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();
  });

  it('shows error state when seasons fail to load', () => {
    useGetSeasonsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
    });

    render(<SeasonTable />);
    
    expect(screen.getByText('Error loading seasons data')).toBeInTheDocument();
  });

  it('calls handleSeasonClick when a season row is clicked', async () => {
    render(<SeasonTable />);

    await waitFor(() => {
      expect(screen.getByText('2023')).toBeInTheDocument();
    });

    // Click on the 2023 season
    fireEvent.click(screen.getByText('2023'));
    
    // Check if handleSeasonClick was called
    expect(mockHandleSeasonClick).toHaveBeenCalledWith(2023);
  });
}); 