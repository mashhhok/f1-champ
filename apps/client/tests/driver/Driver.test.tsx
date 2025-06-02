import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const testTheme = createTheme();

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ alt, ...props }: any) {
    return <img alt={alt} {...props} />;
  };
});

// Mock Redux slice with improved memoization
const mockRacesSlice = {
  name: 'races',
  initialState: {
    selectedDriver: null,
    isDriverModalOpen: false,
    allRaces: []
  },
  reducers: {}
};

// Create mock store with better state management
const createMockStore = (driverInfo: any = null) => {
  const initialState = {
    races: {
      ...mockRacesSlice.initialState,
      selectedDriver: driverInfo ? `${driverInfo.name} ${driverInfo.surname}` : null,
      allRaces: driverInfo ? [{
        winner: `${driverInfo.name} ${driverInfo.surname}`,
        driverNationality: driverInfo.nationality,
        driverDateOfBirth: driverInfo.dateOfBirth,
        driverUrl: driverInfo.wikipediaUrl,
        permanentNumber: driverInfo.permanentNumber,
        team: driverInfo.team
      }] : []
    }
  };

  return configureStore({
    reducer: {
      races: (state = mockRacesSlice.initialState, action) => {
        return initialState.races;
      }
    },
    preloadedState: initialState
  });
};

// Mock the selectDriverInfo selector with better memoization
jest.mock('../../src/redux/slices/racesSlice', () => {
  let mockCachedDriverInfo: any = null;
  let mockLastState: any = null;

  return {
    selectDriverInfo: (state: any) => {
      // Simple memoization to prevent selector warnings
      if (state === mockLastState && mockCachedDriverInfo) {
        return mockCachedDriverInfo;
      }
      
      mockLastState = state;
      const selectedDriver = state.races.selectedDriver;
      
      if (!selectedDriver || state.races.allRaces.length === 0) {
        mockCachedDriverInfo = null;
        return null;
      }
      
      const race = state.races.allRaces[0];
      const [firstName, ...lastNameParts] = selectedDriver.split(' ');
      
      mockCachedDriverInfo = {
        name: firstName,
        surname: lastNameParts.join(' '),
        nationality: race.driverNationality,
        dateOfBirth: race.driverDateOfBirth,
        wikipediaUrl: race.driverUrl,
        permanentNumber: race.permanentNumber,
        team: race.team,
        imageUrl: ''
      };
      
      return mockCachedDriverInfo;
    }
  };
});

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

  // Helper function to find text that might be split across elements
  const findTextContent = (text: string) => {
    return screen.getByText((content, element) => {
      return element?.textContent === text;
    });
  };

  describe('Driver Data from Redux', () => {
    it('renders driver information when available in Redux store', () => {
      renderWithRedux(mockDriverData);
      
      expect(findTextContent('Max Verstappen')).toBeInTheDocument();
      expect(screen.getByText('#33')).toBeInTheDocument();
      expect(screen.getByText(/Red Bull Racing/)).toBeInTheDocument();
      expect(screen.getByText(/Dutch/)).toBeInTheDocument();
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
      expect(screen.getByText(/Red Bull Racing/)).toBeInTheDocument();
    });

    it('displays nationality information correctly', () => {
      renderWithRedux(mockDriverData);
      
      expect(screen.getByText(/Nationality/)).toBeInTheDocument();
      expect(screen.getByText(/Dutch/)).toBeInTheDocument();
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
      
      expect(findTextContent('Lewis Hamilton')).toBeInTheDocument();
      expect(screen.getByText('#44')).toBeInTheDocument();
      expect(screen.getByText(/Mercedes-AMG Petronas/)).toBeInTheDocument();
      expect(screen.getByText(/British/)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders with correct alt text for image', () => {
      renderWithRedux(mockDriverData);
      
      const image = screen.getByAltText('Max Verstappen');
      expect(image).toBeInTheDocument();
    });

    it('displays permanent number with hash symbol', () => {
      renderWithRedux(mockDriverData);
      
      const permanentNumber = screen.getByText((content) => {
        return content.includes('#') && content.includes('33');
      });
      expect(permanentNumber).toBeInTheDocument();
    });

    it('handles missing driver data gracefully', () => {
      renderWithRedux(null);
      
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
}); 