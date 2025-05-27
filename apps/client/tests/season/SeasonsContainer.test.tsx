/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock fetch for RTK Query
global.fetch = jest.fn();

// Mock data
const mockSeasons = [
  { year: 2023, champion: 'Max Verstappen' },
  { year: 2022, champion: 'Max Verstappen' },
];

const mockRaceWinners = [
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
    driverUrl: 'http://en.wikipedia.org/wiki/Max_Verstappen',
    permanentNumber: '1'
  },
];

// Create mock functions
const mockUseGetSeasonsQuery = jest.fn();
const mockUseGetRaceWinnersQuery = jest.fn();
const mockHandleSeasonClick = jest.fn();
const mockUseSelectedYear = jest.fn();

// Mock the RTK Query hooks
jest.mock('../../src/redux/f1api/f1api', () => ({
  f1Api: {
    reducer: (state = {}, action: any) => state,
    middleware: jest.fn(() => (next: any) => (action: any) => next(action)),
    reducerPath: 'f1Api',
  },
  useGetSeasonsQuery: () => mockUseGetSeasonsQuery(),
  useGetRaceWinnersQuery: () => mockUseGetRaceWinnersQuery(),
}));

// Mock the races actions hook
jest.mock('../../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    updateAllRaces: jest.fn(),
  }),
}));

// Mock the selected year hook
jest.mock('../../src/components/season/hooks/useSelectedYears', () => ({
  useSelectedYear: () => mockUseSelectedYear(),
}));

import SeasonsContainer from '../../src/components/SeasonsContainer';
import racesReducer from '../../src/redux/slices/racesSlice';

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      f1Api: (state = {}, action: any) => state,
      races: racesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('SeasonsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseGetSeasonsQuery.mockReturnValue({
      data: mockSeasons,
      isLoading: false,
      error: null,
    });

    mockUseGetRaceWinnersQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    mockUseSelectedYear.mockReturnValue({
      selectedYear: null,
      handleSeasonClick: mockHandleSeasonClick,
    });
  });

  it('renders season table with data', () => {
    renderWithProvider(<SeasonsContainer />);
    
    // Check if the table headers are rendered
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();
    
    // Check if the seasons are rendered (sorted by year descending)
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getAllByText('Max Verstappen')).toHaveLength(2);
  });

  it('shows error message when seasons fail to load', () => {
    mockUseGetSeasonsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Failed to fetch' },
    });

    renderWithProvider(<SeasonsContainer />);
    
    expect(screen.getByText('Error loading seasons data')).toBeInTheDocument();
  });

  it('handles season click correctly', () => {
    renderWithProvider(<SeasonsContainer />);
    
    // Initially, race details should not be visible
    expect(screen.queryByText('2023 Grand Prix Winners')).not.toBeInTheDocument();
    
    // Click on a season
    fireEvent.click(screen.getByText('2023'));
    expect(mockHandleSeasonClick).toHaveBeenCalledWith(2023);
  });

  it('shows race details when season is selected', () => {
    mockUseSelectedYear.mockReturnValue({
      selectedYear: 2023,
      handleSeasonClick: mockHandleSeasonClick,
    });

    mockUseGetRaceWinnersQuery.mockReturnValue({
      data: mockRaceWinners,
      isLoading: false,
    });

    renderWithProvider(<SeasonsContainer />);
    
    // Race details should be visible
    expect(screen.getByText('2023 Grand Prix Winners')).toBeInTheDocument();
  });

  it('shows loading indicator when race data is loading', () => {
    mockUseSelectedYear.mockReturnValue({
      selectedYear: 2023,
      handleSeasonClick: jest.fn(),
    });

    mockUseGetRaceWinnersQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderWithProvider(<SeasonsContainer />);
    
    // Should show loading indicators (there might be multiple)
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });
}); 