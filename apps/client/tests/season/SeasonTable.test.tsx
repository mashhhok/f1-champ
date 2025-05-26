/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonTable from '../../src/components/season/SeasonTable';
import { SeasonChampion } from '../../src/components/season/types';
import { Race } from '../../src/components/races/types';
import '../../specs/jest-globals';

// Mock Material UI's useTheme hook instead of next/themes
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

// Sample test data
const mockSeasons: SeasonChampion[] = [
  { year: 2023, champion: 'Max Verstappen' },
  { year: 2022, champion: 'Max Verstappen' },
];

const mockRacesByYear: Record<number, Race[]> = {
  2023: [
    { 
      id: '2023-1',
      grandPrix: 'Bahrain Grand Prix', 
      winner: 'Max Verstappen',
      team: 'Red Bull',
      teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Red_Bull_Racing',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix',
      date: '2023-03-05',
      laps: 57,
      time: '1:33:56.736'
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
      time: '1:21:14.894'
    },
  ],
  2022: [
    { 
      id: '2022-1',
      grandPrix: 'Bahrain Grand Prix', 
      winner: 'Charles Leclerc',
      team: 'Ferrari',
      teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Scuderia_Ferrari',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/2022_Bahrain_Grand_Prix',
      date: '2022-03-20',
      laps: 57,
      time: '1:37:33.584'
    }
  ],
};

// Mock RacesTable component to avoid having to mock all its dependencies
jest.mock('../src/components/races/RacesTable', () => {
  return {
    __esModule: true,
    default: ({ races }: { races: Race[] }) => (
      <section aria-label="Race results" role="table">
        {races.map(race => (
          <div key={race.id} role="row">
            <span role="cell">{race.grandPrix}</span>
          </div>
        ))}
      </section>
    ),
  };
});

describe('SeasonTable', () => {
  const mockOnSeasonClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the table with seasons', () => {
    render(
      <SeasonTable
        seasons={mockSeasons}
        onSeasonClick={mockOnSeasonClick}
        selectedYear={null}
        racesByYear={mockRacesByYear}
      />
    );

    // Check header
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();

    // Check seasons are displayed
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getAllByText('Max Verstappen')).toHaveLength(2);
  });

  it('calls onSeasonClick when a season row is clicked', () => {
    render(
      <SeasonTable
        seasons={mockSeasons}
        onSeasonClick={mockOnSeasonClick}
        selectedYear={null}
        racesByYear={mockRacesByYear}
      />
    );

    // Click on the 2023 season
    fireEvent.click(screen.getByText('2023'));
    
    // Check if onSeasonClick was called with the correct year
    expect(mockOnSeasonClick).toHaveBeenCalledWith(2023);
  });

  it('displays races when a season is selected', () => {
    render(
      <SeasonTable
        seasons={mockSeasons}
        onSeasonClick={mockOnSeasonClick}
        selectedYear={2023}
        racesByYear={mockRacesByYear}
      />
    );

    // Check if the races details are displayed
    expect(screen.getByText('2023 Grand Prix Winners')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Race results' })).toBeInTheDocument();
    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Saudi Arabian Grand Prix')).toBeInTheDocument();
  });

  it('does not display races when no season is selected', () => {
    render(
      <SeasonTable
        seasons={mockSeasons}
        onSeasonClick={mockOnSeasonClick}
        selectedYear={null}
        racesByYear={mockRacesByYear}
      />
    );

    // Check that race details are not displayed
    expect(screen.queryByText('2023 Grand Prix Winners')).not.toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Race results' })).not.toBeInTheDocument();
  });
}); 