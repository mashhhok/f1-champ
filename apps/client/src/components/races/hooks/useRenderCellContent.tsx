import { formatDate } from "..";

import { Box, Link } from "@mui/material";
import { Race, TableColumn } from "../types";
import { getStyles } from '../styles';
import { useStyles } from '../../../hooks/useStyles';

import { useRacesActions } from '../hooks';
import { useSelector } from 'react-redux';
import { selectRacesState } from '../../../redux/slices/racesSlice';



interface RenderCellContentProps {
    race: Race;
    column: TableColumn;
    seasonChampion?: string;
} 

export const useRenderCellContent = ({column, race, seasonChampion}: RenderCellContentProps) => {
    const { selectDriver } = useRacesActions();
    const racesState = useSelector(selectRacesState);
    const styles = useStyles(getStyles);
  
    const handleDriverClick = (driverName: string) => {
        // Ensure races data is available before allowing driver selection
        if (racesState.allRaces.length === 0) {
          console.warn('No races data available in Redux when driver clicked');
          return;
        }
        
        selectDriver(driverName);
      };

    const renderCellContent = () => {
    switch (column.id) {
      case 'grandPrix':
        return (
          <Link 
            href={race.wikipediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
          >
            {race.grandPrix}
          </Link>
        );
      case 'winner':
        return (
          <Box 
            sx={styles.winnerCell}
            onClick={() => handleDriverClick(race.winner)}
          >
            {race.winner}
            {seasonChampion && race.winner === seasonChampion && " 🏆"}
          </Box>
        );
      case 'team':
        return (
          <Link 
            href={race.teamWikipediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
          >
            {race.team}
          </Link>
        );
      case 'date':
        return formatDate(race.date);
      case 'laps':
        return race.laps;
      case 'time':
        return race.time;
      default:
        return null;
    }
  };

  return renderCellContent;
};