/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Footer } from '../../src/components/ui/Footer';
import '../jest-globals';

// Create test themes for consistent testing
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#E10600' },
    secondary: { main: '#1E1E1E' },
    background: { paper: '#FFFFFF' },
    text: { primary: '#1E1E1E', secondary: '#B0B0B0' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#E10600' },
    secondary: { main: '#FFFFFF' },
    background: { paper: '#1E1E1E' },
    text: { primary: '#FFFFFF', secondary: '#B0B0B0' },
  },
});

// Helper function to render with theme provider
const renderWithTheme = (component: React.ReactElement, theme = lightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Footer', () => {
  beforeEach(() => {
    // Mock the current year to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the footer with correct structure', () => {
    renderWithTheme(<Footer />);
    
    // Check if the footer element is rendered
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the current year in copyright text', () => {
    renderWithTheme(<Footer />);
    
    // Check if the copyright text includes the current year
    const copyrightText = screen.getByText(/© 2024 F1 Project/);
    expect(copyrightText).toBeInTheDocument();
  });

  it('displays the author name and project description', () => {
    renderWithTheme(<Footer />);
    
    // Check if the full copyright text is present
    const copyrightText = screen.getByText(/Made with love by/);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders the GitHub link with correct attributes', () => {
    renderWithTheme(<Footer />);
    
    // Check if the GitHub link is present
    const githubLink = screen.getByRole('link', { name: /Mariia Riabikova/ });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/mashhhok');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has proper accessibility attributes for external link', () => {
    renderWithTheme(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /Mariia Riabikova/ });
    
    // Check security attributes for external link
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders with light theme styling', () => {
    renderWithTheme(<Footer />, lightTheme);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // The footer should be rendered (specific styling is handled by MUI)
    expect(footer).toHaveStyle({ marginTop: 'auto' });
  });

  it('renders with dark theme styling', () => {
    renderWithTheme(<Footer />, darkTheme);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // The footer should be rendered (specific styling is handled by MUI)
    expect(footer).toHaveStyle({ marginTop: 'auto' });
  });

  it('has responsive layout structure', () => {
    renderWithTheme(<Footer />);
    
    // Check if the container and layout elements are present
    const footer = screen.getByRole('contentinfo');
    const copyrightText = screen.getByText(/© 2024 F1 Project/);
    
    expect(footer).toContainElement(copyrightText);
  });

  it('renders without crashing when theme is not provided', () => {
    // Test that the component can handle missing theme context gracefully
    expect(() => render(<Footer />)).not.toThrow();
  });

  it('updates year dynamically', () => {
    // Test with a different year
    jest.setSystemTime(new Date('2025-06-15'));
    
    renderWithTheme(<Footer />);
    
    const copyrightText = screen.getByText(/© 2025 F1 Project/);
    expect(copyrightText).toBeInTheDocument();
  });

  it('maintains proper semantic structure', () => {
    renderWithTheme(<Footer />);
    
    // Check semantic HTML structure
    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
  });

  it('link is keyboard accessible', () => {
    renderWithTheme(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /Mariia Riabikova/ });
    
    // Link should be focusable
    act(() => {
      githubLink.focus();
    });
    expect(githubLink).toHaveFocus();
  });

  it('contains all required text content', () => {
    renderWithTheme(<Footer />);
    
    // Check for all parts of the copyright text
    expect(screen.getByText(/F1 Project/)).toBeInTheDocument();
    expect(screen.getByText(/Made with love by/)).toBeInTheDocument();
    expect(screen.getByText(/Mariia Riabikova/)).toBeInTheDocument();
  });
}); 