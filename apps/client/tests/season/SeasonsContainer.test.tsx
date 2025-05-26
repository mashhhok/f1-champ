/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonsContainer from '../../src/components/SeasonsContainer';

import '../../specs/jest-globals';

// Mock the data module
jest.mock('../src/components/season/data', () => ({
  sampleSeasons: [
    { year: 2023, champion: 'Max Verstappen' },
    { year: 2022, champion: 'Max Verstappen' },
  ],
  racesByYear: {
    2023: [
      { round: 1, name: 'Bahrain Grand Prix', winner: 'Max Verstappen' },
    ],
    2022: [
      { round: 1, name: 'Bahrain Grand Prix', winner: 'Charles Leclerc' },
    ]
  }
}));

describe('SeasonsContainer', () => {
  it('renders season table with data', () => {
    render(<SeasonsContainer />);
    
    // Check if the seasons are rendered
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('handles season click correctly', () => {
    render(<SeasonsContainer />);
    
    // Initially, race details should not be visible
    expect(screen.queryByText('2023 Grand Prix Winners')).not.toBeInTheDocument();
    
    // Click on a season
    fireEvent.click(screen.getByText('2023'));
    
    // Race details should now be visible
    expect(screen.getByText('2023 Grand Prix Winners')).toBeInTheDocument();
    
    // Click the same season again to collapse
    fireEvent.click(screen.getByText('2023'));
    
    // Race details should not be visible again
    expect(screen.queryByText('2023 Grand Prix Winners')).not.toBeInTheDocument();
  });
}); 