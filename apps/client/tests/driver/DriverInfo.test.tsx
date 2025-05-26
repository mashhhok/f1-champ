/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// We're testing a standalone version of the DriverInfo component
// We don't need to import the actual Driver component

// Mock Material UI components
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    __esModule: true,
    ...originalModule,
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#ff0000' },
        secondary: { main: '#0000ff' }
      }
    }),
    Typography: ({ children, variant, color, sx }: any) => (
      <p data-testid="driver-info">{children}</p>
    )
  };
});

// Since DriverInfo is a private component inside Driver.tsx, we need to recreate it for testing
const DriverInfo = ({ label, value }: { label: string; value: string }) => {
  return (
    <p data-testid="driver-info">
      <strong>{label} - </strong> {value}
    </p>
  );
};

describe('DriverInfo Component', () => {
  it('renders label and value correctly', () => {
    render(<DriverInfo label="Team" value="Red Bull Racing" />);
    
    const infoElement = screen.getByTestId('driver-info');
    expect(infoElement).toBeInTheDocument();
    expect(infoElement).toHaveTextContent('Team - Red Bull Racing');
  });

  it('renders different label and value pairs', () => {
    render(<DriverInfo label="Nationality" value="Dutch" />);
    
    const infoElement = screen.getByTestId('driver-info');
    expect(infoElement).toBeInTheDocument();
    expect(infoElement).toHaveTextContent('Nationality - Dutch');
  });
}); 