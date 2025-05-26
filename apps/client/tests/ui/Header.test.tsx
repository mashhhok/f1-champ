/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../src/components/ui/Header';
import '../jest-globals';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the ThemeUpdater component
jest.mock('../../src/components/ThemeUpdater', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-updater">Theme Updater Mock</div>,
}));

describe('Header', () => {
  it('renders the header with logo and theme updater', () => {
    render(<Header />);
    
    // Check if the logo is rendered
    const logo = screen.getByAltText('Formula 1 logo');
    expect(logo).toBeInTheDocument();
    
    // Check if the theme updater is rendered
    expect(screen.getByText('Theme Updater Mock')).toBeInTheDocument();
  });
  
  it('has a link to the homepage', () => {
    render(<Header />);
    
    const homeLink = screen.getByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
  });
}); 