import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Race } from '../../components/races/types';
import { RootState } from '../store';

export interface RacesState {
  selectedDriver: string | null;
  isDriverModalOpen: boolean;
  allRaces: Race[]; // Store all races data for driver lookup
}

const initialState: RacesState = {
  selectedDriver: null,
  isDriverModalOpen: false,
  allRaces: [],
};

const racesSlice = createSlice({
  name: 'races',
  initialState,
  reducers: {
    setSelectedDriver: (state, action: PayloadAction<string>) => {
      state.selectedDriver = action.payload;
      state.isDriverModalOpen = true;
    },
    closeDriverModal: (state) => {
      state.isDriverModalOpen = false;
    },
    setAllRaces: (state, action: PayloadAction<Race[]>) => {
      state.allRaces = action.payload;
    },
  },
});

export const { setSelectedDriver, closeDriverModal, setAllRaces } = racesSlice.actions;
export default racesSlice.reducer;

// Memoized Selectors - Only the ones actually used
export const selectRacesState = (state: RootState) => state.races;

// Improved memoized selector for driver information
export const selectDriverInfo = createSelector(
  [selectRacesState],
  (racesState) => {
    if (!racesState.selectedDriver) {
      return null;
    }
    
    if (racesState.allRaces.length === 0) {
      return null;
    }
    
    const race = racesState.allRaces.find(race => 
      race.winner === racesState.selectedDriver
    );
    
    if (!race) {
      return null;
    }
    
    const [firstName, ...lastNameParts] = race.winner.split(' ');
    
    return {
      name: firstName,
      surname: lastNameParts.join(' '),
      nationality: race.driverNationality,
      dateOfBirth: race.driverDateOfBirth,
      wikipediaUrl: race.driverUrl,
      permanentNumber: race.permanentNumber,
      imageUrl: '', // Default empty, could be enhanced with actual driver images
      team: race.team
    };
  }
);

// Selector for modal state with driver info
export const selectDriverModalState = createSelector(
  [selectRacesState, selectDriverInfo],
  (racesState, driverInfo) => ({
    isOpen: racesState.isDriverModalOpen,
    driverInfo
  })
); 