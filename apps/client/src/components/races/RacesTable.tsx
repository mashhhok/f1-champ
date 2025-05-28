'use client';

import { Table,
  TableBody,
  TableContainer,
  Paper } from "@mui/material";
import { RacesTableProps } from "./types";
import { getStyles } from './styles';
import { useStyles } from '../../hooks/useStyles';
import { RACE_TABLE_COLUMNS } from './raceTable/tableConfig';
import { RaceTableHeader, RaceTableRow, DriverModal } from './raceTable';

const RacesTable = ({ races, seasonChampion }: RacesTableProps) => {
  const styles = useStyles(getStyles);

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