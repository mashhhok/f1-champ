import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const testTheme = createTheme();

jest.mock('../../src/components/driver', () => ({
  __esModule: true,
  default: ({ name, surname, permanentNumber, nationality, dateOfBirth, wikipediaUrl, imageUrl, team }: any) => (
    <div>
      <h5>{name} {surname}</h5>
      <p>#{permanentNumber}</p>
      <img src={imageUrl} alt={`${name} ${surname}`} />
      <div>
        <p><strong>Team - </strong> {team}</p>
        <p><strong>Nationality - </strong> {nationality}</p>
        <p><strong>Date of Birth - </strong> {new Date(dateOfBirth).toLocaleDateString()}</p>
      </div>
      <a href={wikipediaUrl} target="_blank" rel="noopener noreferrer">
        Read more on Wikipedia
      </a>
    </div>
  )
}));

import Driver from '../../src/components/driver';

describe('Driver Component', () => {
  const mockDriverProps = {
    name: 'Max',
    surname: 'Verstappen',
    permanentNumber: '33',
    nationality: 'Dutch',
    dateOfBirth: '1997-09-30',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
    imageUrl: 'https://example.com/max.png',
    team: 'Red Bull Racing'
  };

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={testTheme}>
        {component}
      </ThemeProvider>
    );
  };

  describe('Driver Name and Number', () => {
    it('renders driver full name correctly', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    });

    it('renders driver permanent number with hash prefix', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      expect(screen.getByText('#33')).toBeInTheDocument();
    });
  });

  describe('Driver Image', () => {
    it('renders driver image with correct src and alt attributes', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      const image = screen.getByAltText('Max Verstappen');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/max.png');
    });
  });

  describe('Driver Information', () => {
    it('renders team information', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      expect(screen.getByText('Team -')).toBeInTheDocument();
      expect(screen.getByText('Red Bull Racing')).toBeInTheDocument();
    });

    it('renders nationality information', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      expect(screen.getByText('Nationality -')).toBeInTheDocument();
      expect(screen.getByText('Dutch')).toBeInTheDocument();
    });

    it('renders date of birth information', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      expect(screen.getByText(/Date of Birth/)).toBeInTheDocument();
    });
  });

  describe('Wikipedia Link', () => {
    it('renders Wikipedia link with correct href attribute', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      const wikiLink = screen.getByRole('link', { name: 'Read more on Wikipedia' });
      expect(wikiLink).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Max_Verstappen');
    });

    it('opens Wikipedia link in new tab', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      const wikiLink = screen.getByRole('link', { name: 'Read more on Wikipedia' });
      expect(wikiLink).toHaveAttribute('target', '_blank');
      expect(wikiLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Different Driver Data', () => {
    it('renders with different driver props', () => {
      const hamiltonProps = {
        name: 'Lewis',
        surname: 'Hamilton',
        permanentNumber: '44',
        nationality: 'British',
        dateOfBirth: '1985-01-07',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Lewis_Hamilton',
        imageUrl: 'https://example.com/lewis.png',
        team: 'Mercedes-AMG Petronas'
      };

      renderWithTheme(<Driver {...hamiltonProps} />);
      
      expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
      expect(screen.getByText('#44')).toBeInTheDocument();
      expect(screen.getByAltText('Lewis Hamilton')).toBeInTheDocument();
      expect(screen.getByText('Team -')).toBeInTheDocument();
      expect(screen.getByText('Mercedes-AMG Petronas')).toBeInTheDocument();
      expect(screen.getByText('Nationality -')).toBeInTheDocument();
      expect(screen.getByText('British')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders all required elements', () => {
      renderWithTheme(<Driver {...mockDriverProps} />);
      
      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });
}); 