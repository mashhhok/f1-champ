/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MUIThemeProvider from '../../src/components/helpers/MUIThemeProvider';
import '../jest-globals';

// Mock next-themes
const mockUseTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock the theme files
jest.mock('../../src/app/theme/theme', () => ({
  darkTheme: {
    palette: {
      mode: 'dark',
      primary: { main: '#E10600' },
      background: { default: '#1E1E1E', paper: '#1E1E1E' },
      text: { primary: '#FFFFFF' },
    },
  },
  lightTheme: {
    palette: {
      mode: 'light',
      primary: { main: '#E10600' },
      background: { default: '#FFFFFF', paper: '#FFFFFF' },
      text: { primary: '#1E1E1E' },
    },
  },
  globalStyles: {},
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ThemeProvider: ({ children, theme }: { children: React.ReactNode; theme: any }) => (
    <div className="mui-theme-provider" data-theme={theme?.palette?.mode}>
      {children}
    </div>
  ),
  CssBaseline: () => <div className="css-baseline" />,
  GlobalStyles: ({ styles }: { styles: any }) => (
    <div className="global-styles" />
  ),
}));

describe('MUIThemeProvider', () => {
  const TestChild = () => <div>Test Content</div>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Default theme mock
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
    });
  });

  it('renders children correctly after mounting', async () => {
    render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    // With our mocks, children render immediately
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies dark theme by default', async () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
    });

    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      const themeProvider = container.querySelector('.mui-theme-provider');
      expect(themeProvider).toBeInTheDocument();
    });

    const themeProvider = container.querySelector('.mui-theme-provider');
    expect(themeProvider).toHaveAttribute('data-theme', 'dark');
  });

  it('applies light theme when resolvedTheme is light', async () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    });

    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      const themeProvider = container.querySelector('.mui-theme-provider');
      expect(themeProvider).toBeInTheDocument();
    });

    const themeProvider = container.querySelector('.mui-theme-provider');
    expect(themeProvider).toHaveAttribute('data-theme', 'light');
  });

  it('switches theme when resolvedTheme changes', async () => {
    const { container, rerender } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    // Wait for initial mount with dark theme
    await waitFor(() => {
      const themeProvider = container.querySelector('.mui-theme-provider');
      expect(themeProvider).toHaveAttribute('data-theme', 'dark');
    });

    // Change to light theme
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    });

    rerender(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      const themeProvider = container.querySelector('.mui-theme-provider');
      expect(themeProvider).toHaveAttribute('data-theme', 'light');
    });
  });

  it('includes CssBaseline component', async () => {
    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      expect(container.querySelector('.css-baseline')).toBeInTheDocument();
    });
  });

  it('includes GlobalStyles component', async () => {
    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      expect(container.querySelector('.global-styles')).toBeInTheDocument();
    });
  });

  it('renders correctly without hydration mismatch concerns', () => {
    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    // With our mocks, components render immediately
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(container.querySelector('.mui-theme-provider')).toBeInTheDocument();
  });

  it('handles undefined resolvedTheme gracefully', async () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: undefined,
    });

    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      const themeProvider = container.querySelector('.mui-theme-provider');
      expect(themeProvider).toBeInTheDocument();
    });

    // Should default to dark theme when resolvedTheme is undefined
    const themeProvider = container.querySelector('.mui-theme-provider');
    expect(themeProvider).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains proper component hierarchy', async () => {
    const { container } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    await waitFor(() => {
      expect(container.querySelector('.mui-theme-provider')).toBeInTheDocument();
    });

    const themeProvider = container.querySelector('.mui-theme-provider');
    const cssBaseline = container.querySelector('.css-baseline');
    const globalStyles = container.querySelector('.global-styles');

    expect(themeProvider).toBeInTheDocument();
    expect(cssBaseline).toBeInTheDocument();
    expect(globalStyles).toBeInTheDocument();
    
    expect(themeProvider).toContainElement(cssBaseline as HTMLElement);
    expect(themeProvider).toContainElement(globalStyles as HTMLElement);
    expect(themeProvider).toHaveTextContent('Test Content');
  });

  it('renders multiple children correctly', async () => {
    render(
      <MUIThemeProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </MUIThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  it('exports as default export', () => {
    const MUIThemeProviderModule = require('../../src/components/helpers/MUIThemeProvider');
    expect(MUIThemeProviderModule.default).toBeDefined();
    expect(typeof MUIThemeProviderModule.default).toBe('function');
  });

  it('handles rapid theme changes without errors', async () => {
    const { container, rerender } = render(
      <MUIThemeProvider>
        <TestChild />
      </MUIThemeProvider>
    );

    // Wait for initial mount
    await waitFor(() => {
      expect(container.querySelector('.mui-theme-provider')).toBeInTheDocument();
    });

    // Rapidly change themes
    for (let i = 0; i < 5; i++) {
      mockUseTheme.mockReturnValue({
        resolvedTheme: i % 2 === 0 ? 'light' : 'dark',
      });

      rerender(
        <MUIThemeProvider>
          <TestChild />
        </MUIThemeProvider>
      );
    }

    // Should still render correctly
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 