import { Race } from '../races/types';

// Interface for season champion data
export interface SeasonChampion {
  year: number;
  champion: string;
  isSeasonEnded: boolean;
}

// Interface for SeasonRow component props
export interface SeasonRowProps {
  season: SeasonChampion;
  isSelected: boolean;
  onClick: () => void;
}

// Interface for SeasonDetails component props
export interface SeasonDetailsProps {
  year: number;
  isOpen: boolean;
  races: Race[];
  seasonChampion?: string;
} 