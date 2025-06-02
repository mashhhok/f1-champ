import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceTableCell from '../../../src/components/races/raceTable/RaceTableCell';
import { Race, TableColumn } from '../../../src/components/races/types';

// Mock Material UI components
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...(originalModule as any),
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#E10600' }, // F1_RED
        secondary: { main: '#1E1E1E' }, // F1_BLACK
        background: { paper: '#FFFFFF' }, // F1_WHITE
        text: { primary: '#1E1E1E', secondary: '#B0B0B0' }, // TEXT_PRIMARY_LIGHT, TEXT_SECONDARY_LIGHT
      },
    }),
  };
});

// Mock useStyles hook
jest.mock('../../../src/hooks/useStyles', () => ({
  useStyles: () => ({
    bodyCell: {},
    winnerCell: {}
  })
}));

// Mock styles
jest.mock('../../../src/components/races/styles', () => ({
  getStyles: () => ({
    bodyCell: {},
    winnerCell: {}
  })
}));

// Mock useRenderCellContent hook
jest.mock('../../../src/components/races/hooks/useRenderCellContent', () => ({
  useRenderCellContent: ({ column, race, seasonChampion }: any) => {
    return () => {
      switch (column.id) {
        case 'grandPrix':
          return race.grandPrix;
        case 'winner':
          return seasonChampion === race.winner ? `${race.winner} 🏆` : race.winner;
        case 'team':
          return race.team;
        case 'date':
          return new Date(race.date).toLocaleDateString();
        case 'laps':
          return race.laps;
        case 'time':
          return race.time;
        default:
          return '';
      }
    };
  }
}));

describe('RaceTableCell', () => {
  const mockRace: Race = {
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
    permanentNumber: '33'
  };

  it('renders grand prix cell correctly', () => {
    const column: TableColumn = { id: 'grandPrix', label: 'Grand Prix' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
  });

  it('renders winner cell correctly', () => {
    const column: TableColumn = { id: 'winner', label: 'Winner' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
  });

  it('renders team cell correctly', () => {
    const column: TableColumn = { id: 'team', label: 'Team' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Red Bull')).toBeInTheDocument();
  });

  it('renders date cell correctly', () => {
    const column: TableColumn = { id: 'date', label: 'Date' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    // The date should be formatted by the mock
    expect(screen.getByRole('cell')).toBeInTheDocument();
  });

  it('renders season champion with trophy', () => {
    const column: TableColumn = { id: 'winner', label: 'Winner' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell 
              race={mockRace} 
              column={column} 
              seasonChampion="Max Verstappen" 
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Max Verstappen 🏆')).toBeInTheDocument();
  });

  it('renders laps cell correctly', () => {
    const column: TableColumn = { id: 'laps', label: 'Laps' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('57')).toBeInTheDocument();
  });

  it('renders time cell correctly', () => {
    const column: TableColumn = { id: 'time', label: 'Time' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('1:33:56.736')).toBeInTheDocument();
  });

  it('handles columns with hide properties', () => {
    const column: TableColumn = { 
      id: 'date', 
      label: 'Date', 
      hideOnXs: true, 
      hideOnSm: true 
    };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('cell')).toBeInTheDocument();
  });
}); 