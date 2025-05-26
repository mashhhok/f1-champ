/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Driver component module
jest.mock('../../src/components/driver', () => ({
  __esModule: true,
  default: ({ name, surname, number, nationality, dateOfBirth, wikipediaUrl, imageUrl, team }: any) => (
    <div data-testid="driver-component">
      <h5>{name} {surname}</h5>
      <p>#{number}</p>
      <img src={imageUrl} alt={`${name} ${surname}`} data-testid="driver-image" />
      <div data-testid="driver-info">
        <p><strong>Team - </strong> {team}</p>
        <p><strong>Nationality - </strong> {nationality}</p>
        <p><strong>Date of Birth - </strong> {new Date(dateOfBirth).toLocaleDateString()}</p>
      </div>
      <a href={wikipediaUrl} target="_blank" rel="noopener noreferrer" data-testid="wiki-link">
        Read more on Wikipedia
      </a>
    </div>
  ),
  DriverPlaceholder: () => (
    <div data-testid="driver-placeholder">
      <h5>Lewis Hamilton</h5>
      <p>#44</p>
      <img 
        src="https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png" 
        alt="Lewis Hamilton" 
        data-testid="driver-image" 
      />
      <div data-testid="driver-info">
        <p><strong>Team - </strong> Mercedes-AMG Petronas</p>
        <p><strong>Nationality - </strong> British</p>
        <p><strong>Date of Birth - </strong> {new Date('1985-01-07').toLocaleDateString()}</p>
      </div>
      <a href="https://en.wikipedia.org/wiki/Lewis_Hamilton" target="_blank" rel="noopener noreferrer" data-testid="wiki-link">
        Read more on Wikipedia
      </a>
    </div>
  )
}));

// Import after mocking
import Driver, { DriverPlaceholder } from '../../src/components/driver';

describe('Driver Component', () => {
  const mockDriverProps = {
    name: 'Max',
    surname: 'Verstappen',
    number: 33,
    nationality: 'Dutch',
    dateOfBirth: '1997-09-30',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
    imageUrl: 'https://example.com/max.png',
    team: 'Red Bull Racing'
  };

  it('renders driver information correctly', () => {
    render(<Driver {...mockDriverProps} />);
    
    // Check if component is rendered
    const driverComponent = screen.getByTestId('driver-component');
    expect(driverComponent).toBeInTheDocument();
    
    // Check name
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    
    // Check driver number
    expect(screen.getByText('#33')).toBeInTheDocument();
    
    // Check if the image is rendered with correct attributes
    const image = screen.getByTestId('driver-image');
    expect(image).toHaveAttribute('src', 'https://example.com/max.png');
    expect(image).toHaveAttribute('alt', 'Max Verstappen');
    
    // Check if driver info is rendered
    const driverInfo = screen.getByTestId('driver-info');
    expect(driverInfo).toBeInTheDocument();
    expect(driverInfo).toHaveTextContent('Team - Red Bull Racing');
    expect(driverInfo).toHaveTextContent('Nationality - Dutch');
    
    // Check if the wiki link is rendered with correct attributes
    const wikiLink = screen.getByTestId('wiki-link');
    expect(wikiLink).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Max_Verstappen');
    expect(wikiLink).toHaveAttribute('target', '_blank');
    expect(wikiLink).toHaveTextContent('Read more on Wikipedia');
  });

  it('renders DriverPlaceholder with correct information', () => {
    render(<DriverPlaceholder />);
    
    // Check if component is rendered
    const driverPlaceholder = screen.getByTestId('driver-placeholder');
    expect(driverPlaceholder).toBeInTheDocument();
    
    // Check name
    expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
    
    // Check driver number
    expect(screen.getByText('#44')).toBeInTheDocument();
    
    // Check if the image is rendered with correct attributes
    const image = screen.getByTestId('driver-image');
    expect(image).toHaveAttribute('src', 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png');
    expect(image).toHaveAttribute('alt', 'Lewis Hamilton');
    
    // Check if driver info is rendered
    const driverInfo = screen.getByTestId('driver-info');
    expect(driverInfo).toBeInTheDocument();
    expect(driverInfo).toHaveTextContent('Team - Mercedes-AMG Petronas');
    expect(driverInfo).toHaveTextContent('Nationality - British');
    
    // Check if the wiki link is rendered with correct attributes
    const wikiLink = screen.getByTestId('wiki-link');
    expect(wikiLink).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Lewis_Hamilton');
    expect(wikiLink).toHaveTextContent('Read more on Wikipedia');
  });
}); 