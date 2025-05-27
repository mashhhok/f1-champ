/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceTableHeader from '../../../src/components/races/raceTable/RaceTableHeader';
import { TableColumn } from '../../../src/components/races/types';
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

describe('RaceTableHeader', () => {
  const mockColumns: TableColumn[] = [
    { id: 'grandPrix', label: 'Grand Prix', minWidth: 'sm' },
    { id: 'winner', label: 'Winner', minWidth: 'sm' },
    { id: 'team', label: 'Team', minWidth: 'sm' },
    { id: 'date', label: 'Date', minWidth: 'sm', hideOnXs: true },
    { id: 'laps', label: 'Laps', minWidth: 'md', hideOnXs: true, hideOnSm: true },
    { id: 'time', label: 'Time', minWidth: 'md', hideOnXs: true, hideOnSm: true },
  ];

  it('renders all column headers correctly', () => {
    render(
      <table>
        <RaceTableHeader columns={mockColumns} />
      </table>
    );
    
    expect(screen.getByText('Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Laps')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('renders with empty columns array', () => {
    render(
      <table>
        <RaceTableHeader columns={[]} />
      </table>
    );
    
    // Should render table head but no cells
    const tableHead = document.querySelector('thead');
    expect(tableHead).toBeInTheDocument();
    
    const tableCells = document.querySelectorAll('th');
    expect(tableCells).toHaveLength(0);
  });

  it('renders correct number of header cells', () => {
    render(
      <table>
        <RaceTableHeader columns={mockColumns} />
      </table>
    );
    
    const headerCells = document.querySelectorAll('th');
    expect(headerCells).toHaveLength(mockColumns.length);
  });

  it('preserves column order', () => {
    const orderedColumns: TableColumn[] = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
      { id: 'third', label: 'Third' },
    ];

    render(
      <table>
        <RaceTableHeader columns={orderedColumns} />
      </table>
    );
    
    const headerCells = document.querySelectorAll('th');
    expect(headerCells[0]).toHaveTextContent('First');
    expect(headerCells[1]).toHaveTextContent('Second');
    expect(headerCells[2]).toHaveTextContent('Third');
  });

  it('renders columns with responsive visibility classes', () => {
    const responsiveColumns: TableColumn[] = [
      { id: 'visible', label: 'Always Visible' },
      { id: 'hideXs', label: 'Hide on XS', hideOnXs: true },
      { id: 'hideSm', label: 'Hide on SM', hideOnSm: true },
      { id: 'hideBoth', label: 'Hide on Both', hideOnXs: true, hideOnSm: true },
    ];

    render(
      <table>
        <RaceTableHeader columns={responsiveColumns} />
      </table>
    );
    
    // Verify all columns are rendered (responsive behavior is handled by CSS)
    expect(screen.getByText('Always Visible')).toBeInTheDocument();
    expect(screen.getByText('Hide on XS')).toBeInTheDocument();
    expect(screen.getByText('Hide on SM')).toBeInTheDocument();
    expect(screen.getByText('Hide on Both')).toBeInTheDocument();
    
    const headerCells = document.querySelectorAll('th');
    expect(headerCells).toHaveLength(4);
  });
}); 