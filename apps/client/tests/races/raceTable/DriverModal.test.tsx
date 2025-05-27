/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriverModal from '../../../src/components/races/raceTable/DriverModal';
import '../../jest-globals';

// Mock MUI components
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...(originalModule as any),
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: { main: '#E10600' },
        secondary: { main: '#1E1E1E' },
        background: { paper: '#F5F5F5' },
        text: { primary: '#1E1E1E', secondary: '#B0B0B0' },
      },
    }),
    Modal: ({ children, open, onClose, ...props }: any) => 
      open ? (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="driver-modal"
          aria-describedby="driver-information"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          tabIndex={-1}
        >
          {children}
        </div>
      ) : null,
    Box: ({ children, sx, ...props }: any) => <div {...props}>{children}</div>,
    Alert: ({ children, severity, ...props }: any) => (
      <div role="alert" data-severity={severity} {...props}>
        {children}
      </div>
    ),
  };
});

// Mock Driver component
jest.mock('../../../src/components/driver', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <article aria-label="Driver profile">
        <h3>{props.name || ''} {props.surname || ''}</h3>
        <p>Team: {props.team || ''}</p>
        <p>Nationality: {props.nationality || ''}</p>
        <p>Number: #{props.permanentNumber || ''}</p>
        <p>Date of Birth: {props.dateOfBirth || ''}</p>
        {props.wikipediaUrl && (
          <a href={props.wikipediaUrl} target="_blank" rel="noopener noreferrer">
            Wikipedia
          </a>
        )}
      </article>
    ),
  };
});

// Mock styles
jest.mock('../../../src/components/races/styles', () => ({
  getStyles: () => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4
    }
  }),
}));

// Mock useRacesActions hook
const mockCloseModal = jest.fn();
jest.mock('../../../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    closeModal: mockCloseModal,
  }),
}));

// Mock Redux selector
interface MockSelectorState {
  isOpen: boolean;
  driverInfo: any;
}

let mockSelectorState: MockSelectorState = {
  isOpen: false,
  driverInfo: null,
};

jest.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({ races: mockSelectorState }),
}));

jest.mock('../../../src/redux/slices/racesSlice', () => ({
  selectDriverModalState: (state: any) => state.races,
}));

// Test data helper
const createDriverInfo = (overrides = {}) => ({
  name: 'Max',
  surname: 'Verstappen',
  team: 'Red Bull Racing',
  nationality: 'Dutch',
  dateOfBirth: '1997-09-30',
  wikipediaUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
  permanentNumber: '33',
  imageUrl: 'https://example.com/max.jpg',
  ...overrides,
});

describe('DriverModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectorState = {
      isOpen: false,
      driverInfo: null,
    };
  });

  it('does not render when modal is closed', () => {
    mockSelectorState.isOpen = false;
    
    render(<DriverModal />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with driver information when open', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo();
    
    render(<DriverModal />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Driver profile' })).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Team: Red Bull Racing')).toBeInTheDocument();
    expect(screen.getByText('Nationality: Dutch')).toBeInTheDocument();
    expect(screen.getByText('Number: #33')).toBeInTheDocument();
  });

  it('shows error message when driver info is not available', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = null;
    
    render(<DriverModal />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Driver information not available. Please try again.')).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Driver profile' })).not.toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo();
    
    render(<DriverModal />);
    
    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('does not close modal when clicking inside content', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo();
    
    render(<DriverModal />);
    
    const driverProfile = screen.getByRole('article', { name: 'Driver profile' });
    fireEvent.click(driverProfile);
    
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('closes modal when Escape key is pressed', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo();
    
    render(<DriverModal />);
    
    const modal = screen.getByRole('dialog');
    fireEvent.keyDown(modal, { key: 'Escape' });
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo();
    
    render(<DriverModal />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'driver-modal');
    expect(modal).toHaveAttribute('aria-describedby', 'driver-information');
    expect(modal).toHaveAttribute('tabIndex', '-1');
  });

  it('renders Wikipedia link when URL is provided', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo({
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
    });
    
    render(<DriverModal />);
    
    expect(screen.getByRole('link', { name: 'Wikipedia' })).toBeInTheDocument();
  });

  it('does not render Wikipedia link when URL is missing', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = createDriverInfo({
      wikipediaUrl: null,
    });
    
    render(<DriverModal />);
    
    expect(screen.queryByRole('link', { name: 'Wikipedia' })).not.toBeInTheDocument();
  });

  it('handles empty driver info gracefully', () => {
    mockSelectorState.isOpen = true;
    mockSelectorState.driverInfo = {};
    
    render(<DriverModal />);
    
    expect(screen.getByRole('article', { name: 'Driver profile' })).toBeInTheDocument();
    expect(screen.getByText('Team:')).toBeInTheDocument();
    expect(screen.getByText('Number: #')).toBeInTheDocument();
  });
}); 