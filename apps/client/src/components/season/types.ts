import { Race, SeasonChampion } from '@f1-champ/shared-types';

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