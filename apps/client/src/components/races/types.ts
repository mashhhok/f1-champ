import { Race } from '@f1-champ/shared-types';

// Removed local Race interface (using shared Race from @f1-champ/shared-types)

export interface RacesTableProps {
  races: Race[];
  seasonChampion?: string;
}

// Column definition for tables
export interface TableColumn {
  id: string;
  label: string;
  minWidth?: string;
  hideOnXs?: boolean;
  hideOnSm?: boolean;
} 