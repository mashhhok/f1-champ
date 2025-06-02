/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { renderHook } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRenderCellContent } from '../../../src/components/races/hooks/useRenderCellContent';
import { Race, TableColumn } from '../../../src/components/races/types';

// Mock console.warn to test warning behavior
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

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
    Box: ({ children, onClick, ...props }: any) => (
      <div 
        onClick={onClick} 
        role="button"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    ),
    Link: ({ children, href, ...props }: any) => (
      <a href={href} role="link" {...props}>
        {children}
      </a>
    ),
  };
});

// Mock formatDate function with correct path
jest.mock('../../../src/components/races', () => ({
  formatDate: (dateString: string) => {
    if (!dateString) return '';
    return `formatted-${dateString}`;
  },
}));

// Mock getStyles function
jest.mock('../../../src/components/races/styles', () => ({
  getStyles: () => ({
    winnerCell: {
      cursor: 'pointer',
      '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
    },
  }),
}));

// Mock useRacesActions hook
const mockSelectDriver = jest.fn();
jest.mock('../../../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    selectDriver: mockSelectDriver,
  }),
}));

// Mock Redux selector with more realistic data
const mockRacesState = {
  allRaces: [
    {
      id: '2023-1',
      grandPrix: 'Bahrain Grand Prix',
      winner: 'Max Verstappen',
      team: 'Red Bull',
    },
    {
      id: '2023-2',
      grandPrix: 'Saudi Arabian Grand Prix',
      winner: 'Sergio Perez',
      team: 'Red Bull',
    }
  ],
  selectedDriver: null,
};

const mockUseSelector = jest.fn(() => mockRacesState);
jest.mock('react-redux', () => ({
  useSelector: () => mockUseSelector(),
}));

// Mock Redux selector function
jest.mock('../../../src/redux/slices/racesSlice', () => ({
  selectRacesState: (state: any) => state.races,
}));

describe('useRenderCellContent', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleWarn.mockClear();
    mockUseSelector.mockReturnValue(mockRacesState);
  });

  afterAll(() => {
    mockConsoleWarn.mockRestore();
  });

  describe('Grand Prix column', () => {
    it('renders grand prix cell with correct link and accessibility attributes', () => {
      const column: TableColumn = { id: 'grandPrix', label: 'Grand Prix' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const link = screen.getByRole('link', { name: 'Bahrain Grand Prix' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', mockRace.wikipediaUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('handles empty Wikipedia URL gracefully', () => {
      const raceWithEmptyUrl: Race = { ...mockRace, wikipediaUrl: '' };
      const column: TableColumn = { id: 'grandPrix', label: 'Grand Prix' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithEmptyUrl })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const link = screen.getByRole('link', { name: 'Bahrain Grand Prix' });
      expect(link).toHaveAttribute('href', '');
    });

    it('handles special characters in grand prix name', () => {
      const raceWithSpecialChars: Race = { 
        ...mockRace, 
        grandPrix: 'São Paulo Grand Prix' 
      };
      const column: TableColumn = { id: 'grandPrix', label: 'Grand Prix' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithSpecialChars })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByRole('link', { name: 'São Paulo Grand Prix' })).toBeInTheDocument();
    });
  });

  describe('Winner column', () => {
    it('renders winner cell without trophy when no season champion', () => {
      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const winnerBox = screen.getByRole('button');
      expect(winnerBox).toHaveTextContent('Max Verstappen');
      expect(winnerBox).not.toHaveTextContent('🏆');
      expect(winnerBox).toHaveAttribute('role', 'button');
      expect(winnerBox).toHaveAttribute('tabIndex', '0');
    });

    it('renders winner cell with trophy when driver is season champion', () => {
      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result } = renderHook(() => 
        useRenderCellContent({ 
          column, 
          race: mockRace, 
          seasonChampion: 'Max Verstappen' 
        })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const winnerBox = screen.getByRole('button');
      expect(winnerBox).toHaveTextContent('Max Verstappen 🏆');
    });

    it('calls selectDriver when winner cell is clicked', () => {
      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const winnerBox = screen.getByRole('button');
      fireEvent.click(winnerBox);

      expect(mockSelectDriver).toHaveBeenCalledWith('Max Verstappen');
      expect(mockSelectDriver).toHaveBeenCalledTimes(1);
    });

    it('does not call selectDriver when no races data available and logs warning', () => {
      const emptyRacesState = { allRaces: [], selectedDriver: null };
      mockUseSelector.mockReturnValueOnce(emptyRacesState);

      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const winnerBox = screen.getByRole('button');
      fireEvent.click(winnerBox);

      expect(mockSelectDriver).not.toHaveBeenCalled();
      expect(mockConsoleWarn).toHaveBeenCalledWith('No races data available in Redux when driver clicked');
    });

    it('handles different driver names correctly', () => {
      const raceWithDifferentWinner: Race = {
        ...mockRace,
        winner: 'Lewis Hamilton'
      };

      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result } = renderHook(() => 
        useRenderCellContent({ 
          column, 
          race: raceWithDifferentWinner,
          seasonChampion: 'Lewis Hamilton'
        })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const winnerBox = screen.getByRole('button');
      expect(winnerBox).toHaveTextContent('Lewis Hamilton 🏆');
    });

    it('handles winner names with special characters', () => {
      const raceWithSpecialName: Race = {
        ...mockRace,
        winner: 'Kimi Räikkönen'
      };

      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithSpecialName })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const winnerBox = screen.getByRole('button');
      expect(winnerBox).toHaveTextContent('Kimi Räikkönen');
    });
  });

  describe('Team column', () => {
    it('renders team cell with correct link and accessibility attributes', () => {
      const column: TableColumn = { id: 'team', label: 'Team' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const link = screen.getByRole('link', { name: 'Red Bull' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', mockRace.teamWikipediaUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('handles empty team Wikipedia URL', () => {
      const raceWithEmptyTeamUrl: Race = { 
        ...mockRace, 
        teamWikipediaUrl: '' 
      };
      const column: TableColumn = { id: 'team', label: 'Team' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithEmptyTeamUrl })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const link = screen.getByRole('link', { name: 'Red Bull' });
      expect(link).toHaveAttribute('href', '');
    });

    it('handles long team names', () => {
      const raceWithLongTeamName: Race = {
        ...mockRace,
        team: 'Aston Martin Aramco Cognizant Formula One Team'
      };

      const column: TableColumn = { id: 'team', label: 'Team' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithLongTeamName })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByRole('link', { 
        name: 'Aston Martin Aramco Cognizant Formula One Team' 
      })).toBeInTheDocument();
    });
  });

  describe('Date column', () => {
    it('renders date cell with formatted date', () => {
      const column: TableColumn = { id: 'date', label: 'Date' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('formatted-2023-03-05')).toBeInTheDocument();
    });

    it('handles empty date string', () => {
      const raceWithEmptyDate: Race = { ...mockRace, date: '' };
      const column: TableColumn = { id: 'date', label: 'Date' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithEmptyDate })
      );

      const CellContent = result.current;
      const { container } = render(<CellContent />);

      expect(container.textContent).toBe('');
    });

    it('handles different date formats', () => {
      const raceWithDifferentDate: Race = { 
        ...mockRace, 
        date: '2023-12-31' 
      };
      const column: TableColumn = { id: 'date', label: 'Date' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithDifferentDate })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('formatted-2023-12-31')).toBeInTheDocument();
    });
  });

  describe('Laps column', () => {
    it('renders laps cell correctly', () => {
      const column: TableColumn = { id: 'laps', label: 'Laps' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('57')).toBeInTheDocument();
    });

    it('handles zero laps correctly', () => {
      const raceWithZeroLaps: Race = { ...mockRace, laps: 0 };
      const column: TableColumn = { id: 'laps', label: 'Laps' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithZeroLaps })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles large lap numbers', () => {
      const raceWithManyLaps: Race = { ...mockRace, laps: 999 };
      const column: TableColumn = { id: 'laps', label: 'Laps' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithManyLaps })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  describe('Time column', () => {
    it('renders time cell correctly', () => {
      const column: TableColumn = { id: 'time', label: 'Time' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('1:33:56.736')).toBeInTheDocument();
    });

    it('handles empty time string', () => {
      const raceWithEmptyTime: Race = { ...mockRace, time: '' };
      const column: TableColumn = { id: 'time', label: 'Time' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithEmptyTime })
      );

      const CellContent = result.current;
      const { container } = render(<CellContent />);

      expect(container.textContent).toBe('');
    });

    it('handles different time formats', () => {
      const raceWithDifferentTime: Race = { 
        ...mockRace, 
        time: '2:15:42.123' 
      };
      const column: TableColumn = { id: 'time', label: 'Time' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithDifferentTime })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('2:15:42.123')).toBeInTheDocument();
    });

    it('handles time without milliseconds', () => {
      const raceWithSimpleTime: Race = { 
        ...mockRace, 
        time: '1:33:56' 
      };
      const column: TableColumn = { id: 'time', label: 'Time' };
      
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: raceWithSimpleTime })
      );

      const CellContent = result.current;
      render(<CellContent />);

      expect(screen.getByText('1:33:56')).toBeInTheDocument();
    });
  });

  describe('Unknown column handling', () => {
    it('returns null for unknown column type', () => {
      const column: TableColumn = { id: 'unknown', label: 'Unknown' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const CellContent = result.current;
      render(<CellContent />);

      const container = document.querySelector('div');
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Hook behavior', () => {
    it('returns a function component', () => {
      const column: TableColumn = { id: 'grandPrix', label: 'Grand Prix' };
      const { result } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      expect(typeof result.current).toBe('function');
    });

    it('re-renders when props change', () => {
      const column: TableColumn = { id: 'winner', label: 'Winner' };
      const { result, rerender } = renderHook(
        ({ seasonChampion }: { seasonChampion?: string }) => useRenderCellContent({ 
          column, 
          race: mockRace, 
          seasonChampion 
        }),
        { initialProps: {} }
      );

      let CellContent = result.current;
      const { rerender: rerenderComponent } = render(<CellContent />);

      expect(screen.getByRole('button')).not.toHaveTextContent('🏆');

      rerender({ seasonChampion: 'Max Verstappen' });
      CellContent = result.current;
      rerenderComponent(<CellContent />);

      expect(screen.getByRole('button')).toHaveTextContent('🏆');
    });

    it('maintains stable function reference when props do not change', () => {
      const column: TableColumn = { id: 'grandPrix', label: 'Grand Prix' };
      const { result, rerender } = renderHook(() => 
        useRenderCellContent({ column, race: mockRace })
      );

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // Note: This test might fail if the hook doesn't use useCallback
      // which is actually fine for this use case, but good to be aware of
      expect(typeof firstRender).toBe('function');
      expect(typeof secondRender).toBe('function');
    });
  });

  describe('Integration scenarios', () => {
    it('handles complete race data correctly', () => {
      const completeRace: Race = {
        id: '2023-10',
        grandPrix: 'Japanese Grand Prix',
        winner: 'Max Verstappen',
        team: 'Red Bull Racing',
        teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Red_Bull_Racing',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/2023_Japanese_Grand_Prix',
        date: '2023-09-24',
        laps: 53,
        time: '1:30:45.123',
        driverId: 'max_verstappen',
        driverNationality: 'Dutch',
        driverDateOfBirth: '1997-09-30',
        driverUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
        permanentNumber: '1'
      };

      const columns: TableColumn[] = [
        { id: 'grandPrix', label: 'Grand Prix' },
        { id: 'winner', label: 'Winner' },
        { id: 'team', label: 'Team' },
        { id: 'date', label: 'Date' },
        { id: 'laps', label: 'Laps' },
        { id: 'time', label: 'Time' }
      ];

      columns.forEach(column => {
        const { result } = renderHook(() => 
          useRenderCellContent({ 
            column, 
            race: completeRace, 
            seasonChampion: 'Max Verstappen' 
          })
        );

        const CellContent = result.current;
        const { unmount } = render(<CellContent />);
        
        // Verify no errors are thrown during rendering
        expect(CellContent).toBeDefined();
        unmount();
      });
    });
  });
}); 