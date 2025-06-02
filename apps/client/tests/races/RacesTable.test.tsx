import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RacesTable from '../../src/components/races/RacesTable';
import { Race } from '../../src/components/races/types';

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
    Modal: ({ children, open, onClose }: any) => 
      open ? <div role="dialog" aria-modal="true" aria-label="Driver details">{children}</div> : null,
  };
});

// Mock Driver component
jest.mock('../../src/components/driver', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <article aria-label="Driver profile">
        <h3>{props.name} {props.surname}</h3>
        <p>Team: {props.team}</p>
        <p>Nationality: {props.nationality}</p>
      </article>
    ),
  };
});

// Mock useStyles hook
jest.mock('../../src/hooks/useStyles', () => ({
  useStyles: () => ({
    tableContainer: {},
    tableHead: {},
    headerCell: {},
    bodyCell: {},
    winnerCell: {},
    modal: {}
  })
}));

// Mock Redux hooks with dynamic state
let mockReduxState: {
  selectedDriver: string | null;
  isDriverModalOpen: boolean;
  allRaces: Race[];
} = {
  selectedDriver: null,
  isDriverModalOpen: false,
  allRaces: []
};

const mockDispatch = jest.fn();
const mockSelectDriver = jest.fn((driverName: string) => {
  mockReduxState.selectedDriver = driverName;
  mockReduxState.isDriverModalOpen = true;
});

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => {
    if (selector.toString().includes('selectRacesState')) {
      return mockReduxState;
    }
    return mockReduxState;
  },
}));

// Mock useRacesActions hook
jest.mock('../../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    selectDriver: mockSelectDriver,
    closeModal: jest.fn(),
    updateAllRaces: jest.fn(),
  }),
}));

describe('RacesTable', () => {
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
      permanentNumber: '33'
    },
    { 
      id: '2023-2',
      grandPrix: 'Saudi Arabian Grand Prix', 
      winner: 'Lewis Hamilton',
      team: 'Mercedes',
      teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Mercedes-AMG_Petronas_F1_Team',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/2023_Saudi_Arabian_Grand_Prix',
      date: '2023-03-19',
      laps: 50,
      time: '1:21:14.894',
      driverId: 'lewis_hamilton',
      driverNationality: 'British',
      driverDateOfBirth: '1985-01-07',
      driverUrl: 'https://en.wikipedia.org/wiki/Lewis_Hamilton',
      permanentNumber: '44'
    },
  ];

  beforeEach(() => {
    // Reset mock state before each test
    mockReduxState = {
      selectedDriver: null,
      isDriverModalOpen: false,
      allRaces: mockRaces
    };
    jest.clearAllMocks();
  });

  it('renders the table with races data', () => {
    render(<RacesTable races={mockRaces} />);
    
    // Check column headers
    expect(screen.getByText('Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    
    // Check race data
    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Red Bull')).toBeInTheDocument();
    
    expect(screen.getByText('Saudi Arabian Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
  });

  it('renders empty table when no races provided', () => {
    render(<RacesTable races={[]} />);
    
    // Check column headers are still present
    expect(screen.getByText('Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    
    // Check no race data is present
    expect(screen.queryByText('Bahrain Grand Prix')).not.toBeInTheDocument();
    expect(screen.queryByText('Max Verstappen')).not.toBeInTheDocument();
  });

  it('highlights the season champion with a trophy icon', () => {
    render(<RacesTable races={mockRaces} seasonChampion="Max Verstappen" />);
    
    // Check that the champion has a trophy icon
    const maxCell = screen.getByText(/Max Verstappen 🏆/);
    expect(maxCell).toBeInTheDocument();
    
    // Check that other drivers don't have the trophy
    const lewisCell = screen.getByText('Lewis Hamilton');
    expect(lewisCell).not.toHaveTextContent('🏆');
  });

  it('calls selectDriver when clicking on a driver name', () => {
    render(<RacesTable races={mockRaces} />);
    
    // Click on Max Verstappen's name
    const driverName = screen.getByText('Max Verstappen');
    fireEvent.click(driverName);
    
    // Verify selectDriver was called with the correct driver name
    expect(mockSelectDriver).toHaveBeenCalledWith('Max Verstappen');
    expect(mockSelectDriver).toHaveBeenCalledTimes(1);
  });
}); 