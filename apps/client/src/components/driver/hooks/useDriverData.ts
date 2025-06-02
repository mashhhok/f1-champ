import { useSelector } from 'react-redux';
import { selectDriverInfo } from '../../../redux/slices/racesSlice';

/**
 * Custom hook for accessing driver data from Redux store
 * Returns driver data or null if no driver is selected
 */
export const useDriverData = () => {
  return useSelector(selectDriverInfo);
}; 