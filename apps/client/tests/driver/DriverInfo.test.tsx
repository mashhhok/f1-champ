import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DriverInfo from '../../src/components/driver/DriverInfo';

jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    __esModule: true,
    ...originalModule,
    useTheme: () => originalModule.createTheme(),
    Typography: ({ children, variant, color, sx }: any) => (
      <p>{children}</p>
    )
  };
});

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
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === 'Team - Red Bull Racing';
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('renders different label and value pairs', () => {
    renderWithTheme(<DriverInfo label="Nationality" value="Dutch" />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === 'Nationality - Dutch';
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('renders with empty value', () => {
    renderWithTheme(<DriverInfo label="Team" value="" />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === 'Team -';
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('renders with special characters in label and value', () => {
    renderWithTheme(<DriverInfo label="Driver's Age" value="26 years" />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === "Driver's Age - 26 years";
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('renders label in bold format', () => {
    renderWithTheme(<DriverInfo label="Position" value="1st" />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === 'Position - 1st';
    });
    const element = elements[0];
    expect(element).toBeInTheDocument();
    expect(element.querySelector('strong')).toBeInTheDocument();
  });

  it('displays the complete formatted text', () => {
    renderWithTheme(<DriverInfo label="Date of Birth" value="1997-09-30" />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === 'Date of Birth - 1997-09-30';
    });
    const element = elements[0];
    expect(element).toBeInTheDocument();
  });

  it('handles long text values', () => {
    const longValue = "This is a very long team name that might wrap to multiple lines";
    renderWithTheme(<DriverInfo label="Team" value={longValue} />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === `Team - ${longValue}`;
    });
    expect(elements[0]).toBeInTheDocument();
  });

  it('handles numeric values as strings', () => {
    renderWithTheme(<DriverInfo label="Car Number" value="33" />);
    
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.replace(/\s+/g, ' ').trim() === 'Car Number - 33';
    });
    expect(elements[0]).toBeInTheDocument();
  });
}); 