import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const testTheme = createTheme();

// Mock Redux slice
const mockRacesSlice = {
  name: 'races',
  initialState: {
    selectedDriver: null,
    isDriverModalOpen: false,
    allRaces: []
  },
  reducers: {}
};

// Create mock store
const createMockStore = (driverInfo: any = null) => {
  return configureStore({
    reducer: {
      races: (state = mockRacesSlice.initialState) => state
    },
    preloadedState: {
      races: {
        ...mockRacesSlice.initialState,
        selectedDriver: driverInfo ? 'Mock Driver' : null,
        allRaces: driverInfo ? [{
          winner: 'Mock Driver',
          driverNationality: driverInfo.nationality,
          driverDateOfBirth: driverInfo.dateOfBirth,
          driverUrl: driverInfo.wikipediaUrl,
          permanentNumber: driverInfo.permanentNumber,
          team: driverInfo.team
        }] : []
      }
    }
  });
};

// Mock the selectDriverInfo selector
jest.mock('../../src/redux/slices/racesSlice', () => ({
  selectDriverInfo: (state: any) => {
    const selectedDriver = state.races.selectedDriver;
    if (!selectedDriver || state.races.allRaces.length === 0) return null;
    
    const race = state.races.allRaces[0];
    const [firstName, ...lastNameParts] = selectedDriver.split(' ');
    
    return {
      name: firstName,
      surname: lastNameParts.join(' '),
      nationality: race.driverNationality,
      dateOfBirth: race.driverDateOfBirth,
      wikipediaUrl: race.driverUrl,
      permanentNumber: race.permanentNumber,
      team: race.team,
      imageUrl: ''
    };
  }
}));

import Driver from '../../src/components/driver';

describe('Driver Component (Redux Connected)', () => {
  const mockDriverData = {
    name: 'Max',
    surname: 'Verstappen',
    permanentNumber: '33',
    nationality: 'Dutch',
    dateOfBirth: '1997-09-30',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
    team: 'Red Bull Racing'
  };

  const renderWithRedux = (driverInfo: any = null) => {
    const store = createMockStore(driverInfo);
    return render(
      <Provider store={store}>
        <ThemeProvider theme={testTheme}>
          <Driver />
        </ThemeProvider>
      </Provider>
    );
  };

  describe('Driver Data from Redux', () => {
    it('renders driver information when available in Redux store', () => {
      renderWithRedux(mockDriverData);
      
      expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
      expect(screen.getByText('#33')).toBeInTheDocument();
      expect(screen.getByText('Red Bull Racing')).toBeInTheDocument();
      expect(screen.getByText('Dutch')).toBeInTheDocument();
    });

    it('renders error message when no driver data is available', () => {
      renderWithRedux(null);
      
      expect(screen.getByText(/Driver information not available/)).toBeInTheDocument();
      expect(screen.getByText(/Please select a driver from the races table/)).toBeInTheDocument();
    });
  });

  describe('Driver Information Display', () => {
    it('displays team information correctly', () => {
      renderWithRedux(mockDriverData);
      
      expect(screen.getByText(/Team/)).toBeInTheDocument();
      expect(screen.getByText('Red Bull Racing')).toBeInTheDocument();
    });

    it('displays nationality information correctly', () => {
      renderWithRedux(mockDriverData);
      
      expect(screen.getByText(/Nationality/)).toBeInTheDocument();
      expect(screen.getByText('Dutch')).toBeInTheDocument();
    });

    it('displays date of birth information correctly', () => {
      renderWithRedux(mockDriverData);
      
      expect(screen.getByText(/Date of Birth/)).toBeInTheDocument();
    });
  });

  describe('Wikipedia Link', () => {
    it('renders Wikipedia link with correct href when driver data exists', () => {
      renderWithRedux(mockDriverData);
      
      const wikiLink = screen.getByRole('link', { name: /Read more on Wikipedia/i });
      expect(wikiLink).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Max_Verstappen');
      expect(wikiLink).toHaveAttribute('target', '_blank');
      expect(wikiLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Different Driver Data', () => {
    it('renders with different driver data from Redux', () => {
      const hamiltonData = {
        name: 'Lewis',
        surname: 'Hamilton',
        permanentNumber: '44',
        nationality: 'British',
        dateOfBirth: '1985-01-07',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Lewis_Hamilton',
        team: 'Mercedes-AMG Petronas'
      };

      renderWithRedux(hamiltonData);
      
      expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
      expect(screen.getByText('#44')).toBeInTheDocument();
      expect(screen.getByText('Mercedes-AMG Petronas')).toBeInTheDocument();
      expect(screen.getByText('British')).toBeInTheDocument();
    });
  });
}); 