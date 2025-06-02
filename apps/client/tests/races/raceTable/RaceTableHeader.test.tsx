/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceTableHeader from '../../../src/components/races/raceTable/RaceTableHeader';
import { TableColumn } from '../../../src/components/races/types';

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

// Mock useStyles hook
jest.mock('../../../src/hooks/useStyles', () => ({
  useStyles: () => ({
    tableHead: {},
    headerCell: {}
  })
}));

// Mock styles
jest.mock('../../../src/components/races/styles', () => ({
  getStyles: () => ({
    tableHead: {},
    headerCell: {}
  })
}));

describe('RaceTableHeader', () => {
  const mockColumns: TableColumn[] = [
    { id: 'grandPrix', label: 'Grand Prix', minWidth: 'sm' },
    { id: 'winner', label: 'Winner', minWidth: 'sm' },
    { id: 'team', label: 'Team', minWidth: 'sm' },
    { id: 'date', label: 'Date', minWidth: 'sm', hideOnXs: true },
    { id: 'laps', label: 'Laps', minWidth: 'md', hideOnXs: true, hideOnSm: true },
    { id: 'time', label: 'Time', minWidth: 'md', hideOnXs: true, hideOnSm: true },
  ];

  it('renders all column headers', () => {
    render(
      <table>
        <RaceTableHeader columns={mockColumns} />
      </table>
    );

    mockColumns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });
  });

  it('renders without columns', () => {
    render(
      <table>
        <RaceTableHeader columns={[]} />
      </table>
    );

    // Should render empty table head
    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
  });

  it('renders column headers with correct structure', () => {
    render(
      <table>
        <RaceTableHeader columns={mockColumns.slice(0, 3)} />
      </table>
    );

    // Check that headers are rendered in table cells
    expect(screen.getByRole('columnheader', { name: 'Grand Prix' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Winner' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Team' })).toBeInTheDocument();
  });

  it('handles columns with hide properties', () => {
    const columnsWithHide: TableColumn[] = [
      { id: 'visible', label: 'Always Visible' },
      { id: 'hideXs', label: 'Hide on XS', hideOnXs: true },
      { id: 'hideSm', label: 'Hide on SM', hideOnSm: true },
    ];

    render(
      <table>
        <RaceTableHeader columns={columnsWithHide} />
      </table>
    );

    expect(screen.getByRole('columnheader', { name: 'Always Visible' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Hide on XS' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Hide on SM' })).toBeInTheDocument();
  });
}); 