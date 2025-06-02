import { renderHook, act } from '@testing-library/react';
import { useRacesActions } from '../../../src/components/races/hooks/useRacesActions';
import { Race } from '../../../src/components/races/types';

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

// Mock Redux actions
const mockSetSelectedDriver = jest.fn();
const mockCloseDriverModal = jest.fn();
const mockSetAllRaces = jest.fn();

jest.mock('../../../src/redux/slices/racesSlice', () => ({
  setSelectedDriver: (driverName: string) => mockSetSelectedDriver(driverName),
  closeDriverModal: () => mockCloseDriverModal(),
  setAllRaces: (races: Race[]) => mockSetAllRaces(races),
}));

// Test data factory
const createMockRace = (overrides: Partial<Race> = {}): Race => ({
  id: '2023-1',
  grandPrix: 'Bahrain Grand Prix',
  winner: 'Max Verstappen',
  team: 'Red Bull',
  teamWikipediaUrl: 'https://en.wikipedia.org/wiki/Red_Bull_Racing',
  wikipediaUrl: 'https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix',
  date: '2023-03-05',
  laps: 57,
  time: '1:33:56.736',
  driverId: 'max_verstappen',
  driverNationality: 'Dutch',
  driverDateOfBirth: '1997-09-30',
  driverUrl: 'https://en.wikipedia.org/wiki/Max_Verstappen',
  permanentNumber: '33',
  ...overrides,
});

describe('useRacesActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook Structure and API', () => {
    it('returns all expected action functions', () => {
      const { result } = renderHook(() => useRacesActions());

      expect(result.current).toHaveProperty('selectDriver');
      expect(result.current).toHaveProperty('closeModal');
      expect(result.current).toHaveProperty('updateAllRaces');
      
      expect(typeof result.current.selectDriver).toBe('function');
      expect(typeof result.current.closeModal).toBe('function');
      expect(typeof result.current.updateAllRaces).toBe('function');
    });

    it('returns exactly 3 functions and no extra properties', () => {
      const { result } = renderHook(() => useRacesActions());
      const keys = Object.keys(result.current);
      
      expect(keys).toHaveLength(3);
      expect(keys).toEqual(['selectDriver', 'closeModal', 'updateAllRaces']);
    });

    it('actions are memoized and stable across re-renders', () => {
      const { result, rerender } = renderHook(() => useRacesActions());

      const firstRender = {
        selectDriver: result.current.selectDriver,
        closeModal: result.current.closeModal,
        updateAllRaces: result.current.updateAllRaces,
      };

      rerender();

      const secondRender = {
        selectDriver: result.current.selectDriver,
        closeModal: result.current.closeModal,
        updateAllRaces: result.current.updateAllRaces,
      };

      // Functions should be the same reference due to useCallback
      expect(firstRender.selectDriver).toBe(secondRender.selectDriver);
      expect(firstRender.closeModal).toBe(secondRender.closeModal);
      expect(firstRender.updateAllRaces).toBe(secondRender.updateAllRaces);
    });
  });

  describe('selectDriver Action', () => {
    it('dispatches setSelectedDriver action with correct driver name', () => {
      const { result } = renderHook(() => useRacesActions());

      act(() => {
        result.current.selectDriver('Max Verstappen');
      });

      expect(mockSetSelectedDriver).toHaveBeenCalledWith('Max Verstappen');
      expect(mockSetSelectedDriver).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('handles different driver names correctly', () => {
      const { result } = renderHook(() => useRacesActions());
      const drivers = ['Lewis Hamilton', 'Charles Leclerc', 'Lando Norris'];

      drivers.forEach((driver, index) => {
        act(() => {
          result.current.selectDriver(driver);
        });

        expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(index + 1, driver);
      });

      expect(mockDispatch).toHaveBeenCalledTimes(drivers.length);
    });

    it('handles edge cases for driver names', () => {
      const { result } = renderHook(() => useRacesActions());
      const edgeCases = [
        '', // empty string
        'José María López', // special characters
        'Nyck de Vries', // lowercase particles
        'Zhou Guanyu', // non-Western name
        'Jean-Éric Vergne', // hyphens and accents
        '   Max Verstappen   ', // whitespace
      ];

      edgeCases.forEach((driverName, index) => {
        act(() => {
          result.current.selectDriver(driverName);
        });

        expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(index + 1, driverName);
      });

      expect(mockDispatch).toHaveBeenCalledTimes(edgeCases.length);
    });

    it('maintains function reference stability when called multiple times', () => {
      const { result } = renderHook(() => useRacesActions());
      const selectDriverRef = result.current.selectDriver;

      act(() => {
        result.current.selectDriver('Driver 1');
        result.current.selectDriver('Driver 2');
      });

      expect(result.current.selectDriver).toBe(selectDriverRef);
    });
  });

  describe('closeModal Action', () => {
    it('dispatches closeDriverModal action', () => {
      const { result } = renderHook(() => useRacesActions());

      act(() => {
        result.current.closeModal();
      });

      expect(mockCloseDriverModal).toHaveBeenCalledWith();
      expect(mockCloseDriverModal).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('can be called multiple times without issues', () => {
      const { result } = renderHook(() => useRacesActions());

      act(() => {
        result.current.closeModal();
        result.current.closeModal();
        result.current.closeModal();
      });

      expect(mockCloseDriverModal).toHaveBeenCalledTimes(3);
      expect(mockDispatch).toHaveBeenCalledTimes(3);
    });
  });

  describe('updateAllRaces Action', () => {
    it('dispatches setAllRaces action with race data', () => {
      const { result } = renderHook(() => useRacesActions());
      const mockRaces = [createMockRace()];

      act(() => {
        result.current.updateAllRaces(mockRaces);
      });

      expect(mockSetAllRaces).toHaveBeenCalledWith(mockRaces);
      expect(mockSetAllRaces).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('handles empty array correctly', () => {
      const { result } = renderHook(() => useRacesActions());

      act(() => {
        result.current.updateAllRaces([]);
      });

      expect(mockSetAllRaces).toHaveBeenCalledWith([]);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('handles large arrays of races', () => {
      const { result } = renderHook(() => useRacesActions());
      const mockRaces = Array.from({ length: 23 }, (_, index) => 
        createMockRace({
          id: `2023-${index + 1}`,
          grandPrix: `Race ${index + 1}`,
          winner: `Driver ${index + 1}`,
        })
      );

      act(() => {
        result.current.updateAllRaces(mockRaces);
      });

      expect(mockSetAllRaces).toHaveBeenCalledWith(mockRaces);
      expect(mockRaces).toHaveLength(23);
    });

    it('handles races with different data structures', () => {
      const { result } = renderHook(() => useRacesActions());
      const diverseRaces = [
        createMockRace({ winner: 'Max Verstappen', team: 'Red Bull' }),
        createMockRace({ winner: 'Lewis Hamilton', team: 'Mercedes', id: '2023-2' }),
        createMockRace({ winner: 'Charles Leclerc', team: 'Ferrari', id: '2023-3' }),
      ];

      act(() => {
        result.current.updateAllRaces(diverseRaces);
      });

      expect(mockSetAllRaces).toHaveBeenCalledWith(diverseRaces);
    });
  });

  describe('Integration and Complex Scenarios', () => {
    it('handles multiple action calls in sequence', () => {
      const { result } = renderHook(() => useRacesActions());
      const mockRaces = [createMockRace()];

      act(() => {
        result.current.selectDriver('Max Verstappen');
        result.current.updateAllRaces(mockRaces);
        result.current.closeModal();
      });

      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockSetSelectedDriver).toHaveBeenCalledWith('Max Verstappen');
      expect(mockSetAllRaces).toHaveBeenCalledWith(mockRaces);
      expect(mockCloseDriverModal).toHaveBeenCalled();
    });

    it('maintains correct dispatch order for rapid successive calls', () => {
      const { result } = renderHook(() => useRacesActions());

      act(() => {
        result.current.selectDriver('Driver 1');
        result.current.selectDriver('Driver 2');
        result.current.closeModal();
        result.current.selectDriver('Driver 3');
      });

      expect(mockDispatch).toHaveBeenCalledTimes(4);
      expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(1, 'Driver 1');
      expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(2, 'Driver 2');
      expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(3, 'Driver 3');
      expect(mockCloseDriverModal).toHaveBeenCalledTimes(1);
    });

    it('works correctly after component re-renders', () => {
      const { result, rerender } = renderHook(() => useRacesActions());

      act(() => {
        result.current.selectDriver('Before Rerender');
      });

      rerender();

      act(() => {
        result.current.selectDriver('After Rerender');
      });

      expect(mockSetSelectedDriver).toHaveBeenCalledTimes(2);
      expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(1, 'Before Rerender');
      expect(mockSetSelectedDriver).toHaveBeenNthCalledWith(2, 'After Rerender');
    });
  });

  describe('Type Safety and Error Resilience', () => {
    it('selectDriver accepts string parameter as expected', () => {
      const { result } = renderHook(() => useRacesActions());

      // This test ensures TypeScript compilation and runtime behavior align
      expect(() => {
        act(() => {
          result.current.selectDriver('Valid String');
        });
      }).not.toThrow();
    });

    it('updateAllRaces accepts Race array as expected', () => {
      const { result } = renderHook(() => useRacesActions());
      const validRaces: Race[] = [createMockRace()];

      expect(() => {
        act(() => {
          result.current.updateAllRaces(validRaces);
        });
      }).not.toThrow();
    });

    it('closeModal requires no parameters', () => {
      const { result } = renderHook(() => useRacesActions());

      expect(() => {
        act(() => {
          result.current.closeModal();
        });
      }).not.toThrow();
    });
  });

  describe('Performance and Memory', () => {
    it('does not create new function references on every render', () => {
      const { result, rerender } = renderHook(() => useRacesActions());
      
      const initialFunctions = { ...result.current };
      
      // Force multiple re-renders
      for (let i = 0; i < 5; i++) {
        rerender();
      }
      
      expect(result.current.selectDriver).toBe(initialFunctions.selectDriver);
      expect(result.current.closeModal).toBe(initialFunctions.closeModal);
      expect(result.current.updateAllRaces).toBe(initialFunctions.updateAllRaces);
    });

    it('dispatch function is called with correct timing', () => {
      const { result } = renderHook(() => useRacesActions());

      const startTime = Date.now();
      
      act(() => {
        result.current.selectDriver('Test Driver');
      });

      const endTime = Date.now();
      
      expect(mockDispatch).toHaveBeenCalled();
      expect(endTime - startTime).toBeLessThan(100); // Should be nearly instantaneous
    });
  });
}); 