/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DriverInfo from '../../src/components/driver/DriverInfo';

const testTheme = createTheme();

jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    __esModule: true,
    ...originalModule,
    useTheme: () => testTheme,
    Typography: ({ children, variant, color, sx }: any) => (
      <p>{children}</p>
    )
  };
});

describe('DriverInfo Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={testTheme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders label and value correctly', () => {
    renderWithTheme(<DriverInfo label="Team" value="Red Bull Racing" />);
    
    expect(screen.getByText(/Team - Red Bull Racing/)).toBeInTheDocument();
  });

  it('renders different label and value pairs', () => {
    renderWithTheme(<DriverInfo label="Nationality" value="Dutch" />);
    
    expect(screen.getByText(/Nationality - Dutch/)).toBeInTheDocument();
  });

  it('renders with empty value', () => {
    renderWithTheme(<DriverInfo label="Team" value="" />);
    
    expect(screen.getByText(/Team - /)).toBeInTheDocument();
  });

  it('renders with special characters in label and value', () => {
    renderWithTheme(<DriverInfo label="Driver's Age" value="26 years" />);
    
    expect(screen.getByText(/Driver's Age - 26 years/)).toBeInTheDocument();
  });

  it('renders label in bold format', () => {
    renderWithTheme(<DriverInfo label="Position" value="1st" />);
    
    // Check that the label part is wrapped in strong tags
    const element = screen.getByText(/Position - 1st/);
    expect(element.querySelector('strong')).toHaveTextContent('Position - ');
  });

  it('displays the complete formatted text', () => {
    renderWithTheme(<DriverInfo label="Date of Birth" value="1997-09-30" />);
    
    const element = screen.getByText(/Date of Birth - 1997-09-30/);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Date of Birth - 1997-09-30');
  });

  it('handles long text values', () => {
    const longValue = "This is a very long team name that might wrap to multiple lines";
    renderWithTheme(<DriverInfo label="Team" value={longValue} />);
    
    expect(screen.getByText(new RegExp(`Team - ${longValue}`))).toBeInTheDocument();
  });

  it('handles numeric values as strings', () => {
    renderWithTheme(<DriverInfo label="Car Number" value="33" />);
    
    expect(screen.getByText(/Car Number - 33/)).toBeInTheDocument();
  });
}); 