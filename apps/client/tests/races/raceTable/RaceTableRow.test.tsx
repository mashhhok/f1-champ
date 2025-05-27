/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceTableRow from '../../../src/components/races/raceTable/RaceTableRow';
import { Race, TableColumn } from '../../../src/components/races/types';
import '../../jest-globals';

// Mock Material UI components
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...(originalModule as any),
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#E10600' },
        secondary: { main: '#1E1E1E' },
        background: { paper: '#FFFFFF' },
        text: { primary: '#1E1E1E', secondary: '#B0B0B0' },
      },
    }),
    TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  };
});

// Mock RaceTableCell component
jest.mock('../../../src/components/races/raceTable/RaceTableCell', () => {
  return {
    __esModule: true,
    default: ({ race, column, seasonChampion }: any) => (
      <td>
        {column.id === 'winner' && seasonChampion === race.winner 
          ? `${race[column.id]} 🏆` 
          : race[column.id] || 'N/A'}
      </td>
    ),
  };
});

describe('RaceTableRow', () => {
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

  const mockColumns: TableColumn[] = [
    { id: 'grandPrix', label: 'Grand Prix' },
    { id: 'winner', label: 'Winner' },
    { id: 'team', label: 'Team' },
    { id: 'date', label: 'Date' },
  ];

  it('renders race data correctly in table cells', () => {
    render(
      <table>
        <tbody>
          <RaceTableRow race={mockRace} columns={mockColumns} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Red Bull')).toBeInTheDocument();
    expect(screen.getByText('2023-03-05')).toBeInTheDocument();
  });

  it('displays trophy emoji for season champion winner', () => {
    render(
      <table>
        <tbody>
          <RaceTableRow 
            race={mockRace} 
            columns={mockColumns} 
            seasonChampion="Max Verstappen" 
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Max Verstappen 🏆')).toBeInTheDocument();
  });

  it('does not display trophy when driver is not season champion', () => {
    render(
      <table>
        <tbody>
          <RaceTableRow 
            race={mockRace} 
            columns={mockColumns} 
            seasonChampion="Lewis Hamilton" 
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.queryByText('Max Verstappen 🏆')).not.toBeInTheDocument();
  });

  it('renders correct number of cells based on columns', () => {
    render(
      <table>
        <tbody>
          <RaceTableRow race={mockRace} columns={mockColumns} />
        </tbody>
      </table>
    );

    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(mockColumns.length);
  });

  it('handles empty columns array', () => {
    render(
      <table>
        <tbody>
          <RaceTableRow race={mockRace} columns={[]} />
        </tbody>
      </table>
    );

    const cells = screen.queryAllByRole('cell');
    expect(cells).toHaveLength(0);
  });

  it('handles race with missing optional data', () => {
    const incompleteRace: Race = {
      id: '2023-2',
      grandPrix: 'Saudi Arabian Grand Prix',
      winner: 'Lewis Hamilton',
      team: 'Mercedes',
      teamWikipediaUrl: '',
      wikipediaUrl: '',
      date: '2023-03-19',
      laps: 50,
      time: '',
      driverId: 'lewis_hamilton',
      driverNationality: 'British',
      driverDateOfBirth: '1985-01-07',
      driverUrl: '',
      permanentNumber: '44'
    };

    render(
      <table>
        <tbody>
          <RaceTableRow race={incompleteRace} columns={mockColumns} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Saudi Arabian Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
    expect(screen.getByText('2023-03-19')).toBeInTheDocument();
  });
}); 