/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriverModal from '../../../src/components/races/raceTable/DriverModal';

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
  };
});

// Mock Driver component
jest.mock('../../../src/components/driver', () => {
  return {
    __esModule: true,
    default: () => (
      <article aria-label="Driver profile">
        <h3>Max Verstappen</h3>
        <p>Team: Red Bull Racing</p>
        <p>Nationality: Dutch</p>
        <p>Number: #33</p>
        <p>Date of Birth: 1997-09-30</p>
        <a href="https://en.wikipedia.org/wiki/Max_Verstappen" target="_blank" rel="noopener noreferrer">
          Wikipedia
        </a>
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

// Mock useStyles hook
jest.mock('../../../src/hooks/useStyles', () => ({
  useStyles: () => ({
    modal: {}
  })
}));

// Mock useRacesActions hook
const mockCloseModal = jest.fn();
jest.mock('../../../src/components/races/hooks', () => ({
  useRacesActions: () => ({
    closeModal: mockCloseModal,
  }),
}));

// Mock Redux state
interface MockRacesState {
  selectedDriver: string | null;
  isDriverModalOpen: boolean;
  allRaces: any[];
}

let mockRacesState: MockRacesState = {
  selectedDriver: null,
  isDriverModalOpen: false,
  allRaces: []
};

jest.mock('react-redux', () => ({
  useSelector: (selector: any) => {
    return selector({ races: mockRacesState });
  },
}));

jest.mock('../../../src/redux/slices/racesSlice', () => ({
  selectRacesState: (state: any) => state.races,
}));

describe('DriverModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRacesState = {
      selectedDriver: null,
      isDriverModalOpen: false,
      allRaces: []
    };
  });

  it('does not render when modal is closed', () => {
    mockRacesState.isDriverModalOpen = false;
    
    render(<DriverModal />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with driver information when open', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Driver profile' })).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Team: Red Bull Racing')).toBeInTheDocument();
    expect(screen.getByText('Nationality: Dutch')).toBeInTheDocument();
    expect(screen.getByText('Number: #33')).toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('does not close modal when clicking inside content', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    const driverProfile = screen.getByRole('article', { name: 'Driver profile' });
    fireEvent.click(driverProfile);
    
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('closes modal when Escape key is pressed', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    const modal = screen.getByRole('dialog');
    fireEvent.keyDown(modal, { key: 'Escape' });
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'driver-modal');
    expect(modal).toHaveAttribute('aria-describedby', 'driver-information');
    expect(modal).toHaveAttribute('tabIndex', '-1');
  });

  it('renders Wikipedia link', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    expect(screen.getByRole('link', { name: 'Wikipedia' })).toBeInTheDocument();
  });

  it('contains driver information when modal is open', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    expect(screen.getByRole('article', { name: 'Driver profile' })).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Team: Red Bull Racing')).toBeInTheDocument();
  });

  it('renders modal with correct structure', () => {
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    
    render(<DriverModal />);
    
    // Check modal structure
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    
    // Check that Driver component is rendered inside
    const driverComponent = screen.getByRole('article', { name: 'Driver profile' });
    expect(driverComponent).toBeInTheDocument();
  });

  it('handles modal state changes correctly', () => {
    // Start with closed modal
    mockRacesState.isDriverModalOpen = false;
    const { rerender } = render(<DriverModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open the modal
    mockRacesState.isDriverModalOpen = true;
    mockRacesState.selectedDriver = 'Max Verstappen';
    rerender(<DriverModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close the modal again
    mockRacesState.isDriverModalOpen = false;
    rerender(<DriverModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
}); 