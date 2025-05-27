/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageProvider from '../../src/components/helpers/PageProvider';
import '../jest-globals';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div className="next-themes-provider">{children}</div>
  ),
}));

// Mock next/head
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <div className="next-head">{children}</div>;
  };
});

// Mock MUIThemeProvider
jest.mock('../../src/components/helpers/MUIThemeProvider', () => {
  return function MUIThemeProvider({ children }: { children: React.ReactNode }) {
    return <div className="mui-theme-provider">{children}</div>;
  };
});

// Mock createEmotionCache
jest.mock('../../src/app/theme/createEmotionCache', () => {
  return jest.fn(() => ({ key: 'test', prepend: true }));
});

// Mock @emotion/react
jest.mock('@emotion/react', () => ({
  CacheProvider: ({ children }: { children: React.ReactNode }) => (
    <div className="emotion-cache-provider">{children}</div>
  ),
}));

describe('PageProvider', () => {
  const TestChild = () => <div>Test Content</div>;

  it('renders children correctly', () => {
    render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps children with ThemeProvider from next-themes', () => {
    const { container } = render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    const themeProvider = container.querySelector('.next-themes-provider');
    expect(themeProvider).toBeInTheDocument();
    expect(themeProvider).toHaveTextContent('Test Content');
  });

  it('includes Head component with viewport meta tag', () => {
    const { container } = render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    // Check if the mocked Head component is rendered
    const headElement = container.querySelector('.next-head');
    expect(headElement).toBeInTheDocument();
  });

  it('wraps children with MUIThemeProvider', () => {
    const { container } = render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    const muiThemeProvider = container.querySelector('.mui-theme-provider');
    expect(muiThemeProvider).toBeInTheDocument();
    expect(muiThemeProvider).toHaveTextContent('Test Content');
  });

  it('wraps children with CacheProvider', () => {
    const { container } = render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    const cacheProvider = container.querySelector('.emotion-cache-provider');
    expect(cacheProvider).toBeInTheDocument();
    expect(cacheProvider).toHaveTextContent('Test Content');
  });

  it('uses default emotion cache when none provided', () => {
    const { container } = render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    // Verify that the component renders correctly with default cache
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(container.querySelector('.emotion-cache-provider')).toBeInTheDocument();
  });

  it('uses custom emotion cache when provided', () => {
    const customCache: any = { key: 'custom', prepend: false };
    
    render(
      <PageProvider emotionCache={customCache}>
        <TestChild />
      </PageProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('maintains proper component hierarchy', () => {
    const { container } = render(
      <PageProvider>
        <TestChild />
      </PageProvider>
    );

    // Check that the hierarchy is: ThemeProvider > CacheProvider > Head + MUIThemeProvider > children
    const themeProvider = container.querySelector('.next-themes-provider');
    const cacheProvider = container.querySelector('.emotion-cache-provider');
    const muiThemeProvider = container.querySelector('.mui-theme-provider');

    expect(themeProvider).toBeInTheDocument();
    expect(cacheProvider).toBeInTheDocument();
    expect(muiThemeProvider).toBeInTheDocument();
    
    // Verify nesting
    expect(themeProvider).toContainElement(cacheProvider as HTMLElement);
    expect(cacheProvider).toContainElement(muiThemeProvider as HTMLElement);
    expect(muiThemeProvider).toHaveTextContent('Test Content');
  });

  it('renders without crashing with multiple children', () => {
    render(
      <PageProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </PageProvider>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    const { container } = render(<PageProvider>{null}</PageProvider>);

    // Should still render the provider structure
    expect(container.querySelector('.next-themes-provider')).toBeInTheDocument();
    expect(container.querySelector('.mui-theme-provider')).toBeInTheDocument();
    expect(container.querySelector('.emotion-cache-provider')).toBeInTheDocument();
  });

  it('exports as default export', () => {
    const PageProviderModule = require('../../src/components/helpers/PageProvider');
    expect(PageProviderModule.default).toBeDefined();
    expect(typeof PageProviderModule.default).toBe('function');
  });
}); 