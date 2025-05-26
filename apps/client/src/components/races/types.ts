// Race interface for Formula 1 race data
export interface Race {
  id: string;
  grandPrix: string;
  wikipediaUrl: string;
  winner: string;
  team: string;
  teamWikipediaUrl: string;
  date: string;
  laps: number;
  time: string;
  driverId: string;
  driverNationality: string;
  driverDateOfBirth: string;
  driverUrl: string;
  permanentNumber: string;
}

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