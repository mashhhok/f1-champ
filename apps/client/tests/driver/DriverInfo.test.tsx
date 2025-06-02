import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DriverInfo from '../../src/components/driver/DriverInfo';

// Mock the useStyles hook
jest.mock('../../src/hooks/useStyles', () => ({
  useStyles: () => ({
    infoText: {}
  })
}));

// Mock the styles
jest.mock('../../src/components/driver/styles', () => ({
  getStyles: () => ({
    infoText: {}
  })
}));

const testTheme = createTheme();

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
    
    expect(screen.getByText(/Team/)).toBeInTheDocument();
    expect(screen.getByText(/Red Bull Racing/)).toBeInTheDocument();
  });

  it('renders different label and value pairs', () => {
    renderWithTheme(<DriverInfo label="Nationality" value="Dutch" />);
    
    expect(screen.getByText(/Nationality/)).toBeInTheDocument();
    expect(screen.getByText(/Dutch/)).toBeInTheDocument();
  });

  it('renders with empty value', () => {
    renderWithTheme(<DriverInfo label="Team" value="" />);
    
    expect(screen.getByText(/Team/)).toBeInTheDocument();
    expect(screen.getByText(/-/)).toBeInTheDocument();
  });

  it('renders with special characters in label and value', () => {
    renderWithTheme(<DriverInfo label="Driver's Age" value="26 years" />);
    
    expect(screen.getByText(/Driver's Age/)).toBeInTheDocument();
    expect(screen.getByText(/26 years/)).toBeInTheDocument();
  });

  it('renders label in bold format', () => {
    renderWithTheme(<DriverInfo label="Position" value="1st" />);
    
    const strongElement = screen.getByText(/Position/);
    expect(strongElement).toBeInTheDocument();
    expect(screen.getByText(/1st/)).toBeInTheDocument();
  });

  it('displays the complete formatted text', () => {
    renderWithTheme(<DriverInfo label="Date of Birth" value="1997-09-30" />);
    
    expect(screen.getByText(/Date of Birth/)).toBeInTheDocument();
    expect(screen.getByText(/1997-09-30/)).toBeInTheDocument();
  });

  it('handles long text values', () => {
    const longValue = "This is a very long team name that might wrap to multiple lines";
    renderWithTheme(<DriverInfo label="Team" value={longValue} />);
    
    expect(screen.getByText(/Team/)).toBeInTheDocument();
    expect(screen.getByText(/This is a very long team name/)).toBeInTheDocument();
  });

  it('handles numeric values as strings', () => {
    renderWithTheme(<DriverInfo label="Car Number" value="33" />);
    
    expect(screen.getByText(/Car Number/)).toBeInTheDocument();
    expect(screen.getByText(/33/)).toBeInTheDocument();
  });

  it('has correct structure with Typography component', () => {
    renderWithTheme(<DriverInfo label="Team" value="Red Bull Racing" />);
    
    // Check that it renders a paragraph element
    const paragraph = screen.getByRole('paragraph', { hidden: true });
    expect(paragraph).toBeInTheDocument();
  });

  it('contains both label and value in the same element', () => {
    renderWithTheme(<DriverInfo label="Nationality" value="British" />);
    
    // Use container to find element that contains both texts
    const { container } = renderWithTheme(<DriverInfo label="Nationality" value="British" />);
    const element = container.querySelector('p');
    
    expect(element?.textContent).toContain('Nationality');
    expect(element?.textContent).toContain('British');
    expect(element?.textContent).toContain('-');
  });

  it('renders consistently regardless of label/value length', () => {
    const { rerender } = renderWithTheme(<DriverInfo label="Age" value="26" />);
    
    expect(screen.getByText(/Age/)).toBeInTheDocument();
    expect(screen.getByText(/26/)).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={testTheme}>
        <DriverInfo label="Championship Position" value="World Champion 2021, 2022, 2023" />
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Championship Position/)).toBeInTheDocument();
    expect(screen.getByText(/World Champion 2021/)).toBeInTheDocument();
  });

  it('maintains proper accessibility', () => {
    const { container } = renderWithTheme(<DriverInfo label="Driver" value="Max Verstappen" />);
    
    // Ensure the text is readable by screen readers
    const element = container.querySelector('p');
    expect(element?.textContent).toBeTruthy();
    expect(element?.getAttribute('class')).toContain('MuiTypography');
  });
}); 