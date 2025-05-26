import { TableColumn } from "../types";

// Table column configuration for races table
export const RACE_TABLE_COLUMNS: TableColumn[] = [
  { id: 'grandPrix', label: 'Grand Prix', minWidth: 'sm' },
  { id: 'winner', label: 'Winner', minWidth: 'sm' },
  { id: 'team', label: 'Team', minWidth: 'sm' },
  { id: 'date', label: 'Date', minWidth: 'sm', hideOnXs: true },
  { id: 'laps', label: 'Laps', minWidth: 'md', hideOnXs: true, hideOnSm: true },
  { id: 'time', label: 'Time', minWidth: 'md', hideOnXs: true, hideOnSm: true },
]; 