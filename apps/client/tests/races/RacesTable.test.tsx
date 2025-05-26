/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RacesTable from '../../src/components/races/RacesTable';
import { Race } from '../../src/components/races/types';
import '../jest-globals';

// Mock Material UI components
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
        <h3>{props.name}</h3>
        <p>Team: {props.team}</p>
      </article>
    ),
  };
});

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => ({
    selectedDriver: null,
    isDriverModalOpen: false,
    allRaces: []
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

  it('highlights the season champion with a trophy icon', () => {
    render(<RacesTable races={mockRaces} seasonChampion="Max Verstappen" />);
    
    // Check that the champion has a trophy icon
    const maxCell = screen.getByText(/Max Verstappen 🏆/);
    expect(maxCell).toBeInTheDocument();
    
    // Check that other drivers don't have the trophy
    const lewisCell = screen.getByText('Lewis Hamilton');
    expect(lewisCell).not.toHaveTextContent('🏆');
  });

  it('opens driver modal when clicking on a driver name', () => {
    render(<RacesTable races={mockRaces} />);
    
    // Initially, modal should not be present
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Get all elements with Max Verstappen text in the table
    const driverCells = screen.getAllByText('Max Verstappen');
    
    // Click on the first one (which should be in the table, not the modal)
    fireEvent.click(driverCells[0]);
    
    // Modal should now be visible
    expect(screen.getByRole('dialog', { name: 'Driver details' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Driver profile' })).toBeInTheDocument();
    expect(screen.getByText('Team: Red Bull Racing')).toBeInTheDocument();
  });
}); 