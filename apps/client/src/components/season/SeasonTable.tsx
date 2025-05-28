'use client';

import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import { Fragment, useEffect } from "react";
import { SeasonChampion } from "./types";
import { getStyles } from './styles';
import { useStyles } from '../../hooks/useStyles';
import { useGetSeasonsQuery, useGetRaceWinnersQuery } from "../../redux/f1api/f1api";
import { useRacesActions } from "../races/hooks";
import SeasonDetails from "./SeasonDetails";
import SeasonRow from "./SeasonRow";
import { useSelectedYear } from "./hooks/useSelectedYears";

// Components
const TableHeader = () => {
  const styles = useStyles(getStyles);
  
  return (
    <TableHead sx={styles.tableHead}>
      <TableRow>
        <TableCell sx={styles.headerCell}>Season</TableCell>
        <TableCell sx={styles.headerCell}>Champion</TableCell>
      </TableRow>
    </TableHead>
  );
};

// Main Component
const SeasonTable = () => {
  const styles = useStyles(getStyles);
  const { updateAllRaces } = useRacesActions();
  const { selectedYear, handleSeasonClick } = useSelectedYear();

  // Fetch seasons data
  const { 
    data: seasons, 
    isLoading: isLoadingSeasons, 
    error: seasonsError 
  } = useGetSeasonsQuery();
  
  // Fetch race winners when a season is selected
  const { 
    data: raceWinners, 
    isLoading: isLoadingRaces 
  } = useGetRaceWinnersQuery(selectedYear || 0, {
    skip: selectedYear === null
  });
  
  // Update Redux store with race data for driver modal
  useEffect(() => {
    if (raceWinners) {
      updateAllRaces(raceWinners);
    }
  }, [raceWinners, updateAllRaces]);
  
  return (
    <>
    {(isLoadingSeasons || isLoadingRaces) && <CircularProgress />}
    {seasonsError && <Alert severity="error">Error loading seasons data</Alert>}
    <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table>
        <TableHeader />
        <TableBody>
          {seasons ? [...seasons].sort((a, b) => b.year - a.year).map((season: SeasonChampion) => (
            <Fragment key={season.year}>
              <SeasonRow 
                season={season}
                isSelected={selectedYear === season.year}
                onClick={() => handleSeasonClick(season.year)}
              />
              
              {selectedYear === season.year && (
                <SeasonDetails 
                  year={season.year}
                  isOpen={selectedYear === season.year}
                  races={raceWinners || []}
                  seasonChampion={season.champion}
                />
              )}
            </Fragment>
          )) : null}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default SeasonTable; 