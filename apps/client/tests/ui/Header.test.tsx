/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Header } from '../../src/components/ui/Header';
import '../jest-globals';

// Create a test theme for consistent testing
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#E10600' },
    secondary: { main: '#1E1E1E' },
    background: { paper: '#FFFFFF' },
    text: { primary: '#1E1E1E', secondary: '#B0B0B0' },
  },
});

// Mock the next/image component with proper priority handling
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Remove priority prop to avoid React warning about non-boolean attribute
    const { priority, ...restProps } = props;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...restProps} data-priority={priority ? 'true' : 'false'} />;
  },
}));

// Mock the ThemeUpdater component to render a switch
jest.mock('../../src/components/ThemeUpdater', () => ({
  __esModule: true,
  default: () => (
    <div>
      <input type="checkbox" role="switch" aria-label="Toggle theme" />
    </div>
  ),
}));

// Helper function to render with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={testTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Header', () => {
  it('renders the header with logo and theme switch', () => {
    renderWithTheme(<Header />);
    
    // Check if the logo is rendered
    const logo = screen.getByAltText('Formula 1 logo');
    expect(logo).toBeInTheDocument();
    
    // Check if the theme switch is rendered
    const themeSwitch = screen.getByRole('switch', { name: /toggle theme/i });
    expect(themeSwitch).toBeInTheDocument();
  });
  
  it('has a link to the homepage', () => {
    renderWithTheme(<Header />);
    
    const homeLink = screen.getByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders the AppBar with correct structure', () => {
    renderWithTheme(<Header />);
    
    // Check if AppBar is rendered (it should have the banner role)
    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();
  });

  it('logo has correct attributes', () => {
    renderWithTheme(<Header />);
    
    const logo = screen.getByAltText('Formula 1 logo');
    expect(logo).toHaveAttribute('width', '48');
    expect(logo).toHaveAttribute('height', '12');
    expect(logo).toHaveAttribute('data-priority', 'true');
    expect(logo).toHaveClass('hover:cursor-pointer', 'hidden', 'xs:block');
  });

  it('has proper layout structure with toolbar', () => {
    renderWithTheme(<Header />);
    
    // Check if the toolbar contains both logo link and theme switch
    const homeLink = screen.getByRole('link');
    const themeSwitch = screen.getByRole('switch', { name: /toggle theme/i });
    
    expect(homeLink).toBeInTheDocument();
    expect(themeSwitch).toBeInTheDocument();
    
    // Both should be present in the same container
    const banner = screen.getByRole('banner');
    expect(banner).toContainElement(homeLink);
    expect(banner).toContainElement(themeSwitch);
  });

  it('logo link is accessible', () => {
    renderWithTheme(<Header />);
    
    const homeLink = screen.getByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
    
    // The link should contain the logo image
    const logo = screen.getByAltText('Formula 1 logo');
    expect(homeLink).toContainElement(logo);
  });

  it('renders without crashing when theme is not provided', () => {
    // Test that the component can handle missing theme context gracefully
    expect(() => render(<Header />)).not.toThrow();
  });
}); 