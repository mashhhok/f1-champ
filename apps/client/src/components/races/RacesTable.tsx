'use client';

import { 
  Table,
  TableBody,
  TableContainer,
  Paper,
  useTheme
} from "@mui/material";
import { RacesTableProps } from "./types";
import { getStyles } from './styles';
import { RACE_TABLE_COLUMNS } from './raceTable/tableConfig';
import { RaceTableHeader, RaceTableRow, DriverModal } from './raceTable';

const RacesTable = ({ races, seasonChampion }: RacesTableProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table size="small">
          <RaceTableHeader columns={RACE_TABLE_COLUMNS} />
          <TableBody>
            {races.map((race) => (
              <RaceTableRow 
                key={race.id}
                race={race}
                columns={RACE_TABLE_COLUMNS}
                seasonChampion={seasonChampion}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DriverModal />
    </>
  );
};

export default RacesTable; 