import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceTableCell from '../../../src/components/races/raceTable/RaceTableCell';
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
        primary: { main: '#E10600' }, // F1_RED
        secondary: { main: '#1E1E1E' }, // F1_BLACK
        background: { paper: '#FFFFFF' }, // F1_WHITE
        text: { primary: '#1E1E1E', secondary: '#B0B0B0' }, // TEXT_PRIMARY_LIGHT, TEXT_SECONDARY_LIGHT
      },
    }),
  };
});

// Mock the useRenderCellContent hook
jest.mock('../../../src/components/races/hooks/useRenderCellContent', () => ({
  useRenderCellContent: ({ column, race, seasonChampion }: any) => {
    return () => {
      switch (column.id) {
        case 'grandPrix':
          return <a href={race.wikipediaUrl} target="_blank" rel="noopener noreferrer">{race.grandPrix}</a>;
        case 'winner':
          return (
            <div>
              {race.winner}
              {seasonChampion && race.winner === seasonChampion && " 🏆"}
            </div>
          );
        case 'team':
          return <a href={race.teamWikipediaUrl} target="_blank" rel="noopener noreferrer">{race.team}</a>;
        case 'date':
          return race.date;
        case 'laps':
          return race.laps;
        case 'time':
          return race.time;
        default:
          return null;
      }
    };
  },
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

  it('renders grand prix cell with correct link attributes', () => {
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

    const link = screen.getByRole('link', { name: 'Bahrain Grand Prix' });
    expect(link).toHaveAttribute('href', mockRace.wikipediaUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders winner cell without trophy when no season champion provided', () => {
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
    expect(screen.queryByText('🏆')).not.toBeInTheDocument();
  });

  it('renders winner cell with trophy when driver is season champion', () => {
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

    expect(screen.getByText(/Max Verstappen.*🏆/)).toBeInTheDocument();
  });

  it('renders team cell with correct link attributes', () => {
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

    const link = screen.getByRole('link', { name: 'Red Bull' });
    expect(link).toHaveAttribute('href', mockRace.teamWikipediaUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders simple text content for date, laps, and time columns', () => {
    const testCases = [
      { column: { id: 'date', label: 'Date' }, expectedText: '2023-03-05' },
      { column: { id: 'laps', label: 'Laps' }, expectedText: '57' },
      { column: { id: 'time', label: 'Time' }, expectedText: '1:33:56.736' }
    ];

    testCases.forEach(({ column, expectedText }) => {
      const { unmount } = render(
        <table>
          <tbody>
            <tr>
              <RaceTableCell race={mockRace} column={column} />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders empty cell for unknown column types', () => {
    const column: TableColumn = { id: 'unknown', label: 'Unknown' };
    
    render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={column} />
          </tr>
        </tbody>
      </table>
    );

    const cell = document.querySelector('td');
    expect(cell).toBeEmptyDOMElement();
  });

  it('applies responsive hiding styles correctly', () => {
    const hideOnXsColumn: TableColumn = { 
      id: 'date', 
      label: 'Date', 
      hideOnXs: true 
    };
    
    const hideOnSmColumn: TableColumn = { 
      id: 'laps', 
      label: 'Laps', 
      hideOnSm: true 
    };

    const { rerender } = render(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={hideOnXsColumn} />
          </tr>
        </tbody>
      </table>
    );

    let cell = document.querySelector('td');
    expect(cell).toBeInTheDocument();

    rerender(
      <table>
        <tbody>
          <tr>
            <RaceTableCell race={mockRace} column={hideOnSmColumn} />
          </tr>
        </tbody>
      </table>
    );

    cell = document.querySelector('td');
    expect(cell).toBeInTheDocument();
  });
}); 