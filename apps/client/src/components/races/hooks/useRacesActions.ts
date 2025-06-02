import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  setSelectedDriver, 
  closeDriverModal, 
  setAllRaces 
} from '../../../redux/slices/racesSlice';
import { Race } from '@f1-champ/shared-types';

// Custom hook for races actions - Best Practice for Redux
export const useRacesActions = () => {
  const dispatch = useDispatch();

  // Memoized action creators for better performance
  const selectDriver = useCallback((driverName: string) => {
    dispatch(setSelectedDriver(driverName));
  }, [dispatch]);

  const closeModal = useCallback(() => {
    dispatch(closeDriverModal());
  }, [dispatch]);

  const updateAllRaces = useCallback((races: Race[]) => {
    dispatch(setAllRaces(races));
  }, [dispatch]);

  return {
    selectDriver,
    closeModal,
    updateAllRaces
  };
}; 