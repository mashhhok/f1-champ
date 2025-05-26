import { TableRow } from "@mui/material";
import { Race, TableColumn } from "../types";
import RaceTableCell from "./RaceTableCell";

interface RaceTableRowProps {
  race: Race;
  columns: TableColumn[];
  seasonChampion?: string;
}

const RaceTableRow = ({ race, columns, seasonChampion }: RaceTableRowProps) => {
  return (
    <TableRow hover>
      {columns.map((column) => (
        <RaceTableCell 
          key={`${race.id}-${column.id}`}
          race={race}
          column={column}
          seasonChampion={seasonChampion}
        />
      ))}
    </TableRow>
  );
};

export default RaceTableRow; 