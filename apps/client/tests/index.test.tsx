/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Page from '../src/app/page';

// Mock fetch for RTK Query
global.fetch = jest.fn();

// Mock the RTK Query hooks
jest.mock('../src/redux/f1api/f1api', () => ({
  f1Api: {
    reducer: (state = {}, action: any) => state,
    middleware: jest.fn(() => (next: any) => (action: any) => next(action)),
    reducerPath: 'f1Api',
  },
  useGetSeasonsQuery: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  useGetRaceWinnersQuery: () => ({
    data: undefined,
    isLoading: false,
  }),
}));

// Mock the races actions hook
jest.mock('../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    updateAllRaces: jest.fn(),
  }),
}));

// Mock the selected year hook
jest.mock('../src/components/season/hooks/useSelectedYears', () => ({
  useSelectedYear: () => ({
    selectedYear: null,
    handleSeasonClick: jest.fn(),
  }),
}));

import racesReducer from '../src/redux/slices/racesSlice';

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

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProvider(<Page />);
    expect(baseElement).toBeTruthy();
  });
}); 