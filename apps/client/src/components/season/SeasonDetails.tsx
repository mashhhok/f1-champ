import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Collapse,
  useTheme,
  CircularProgress
} from "@mui/material";
import RacesTable from "../races/RacesTable";
import { SeasonDetailsProps } from "./types";
import { getStyles } from './styles';

const SeasonDetails = ({ year, isOpen, races, seasonChampion }: SeasonDetailsProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  return (
    <TableRow>
      <TableCell colSpan={2} sx={styles.racesCell}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box sx={styles.racesContainer}>
            <Typography variant="h6" component="h3" sx={styles.racesTitle}>
              {year} Grand Prix Winners
            </Typography>
            {races.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <RacesTable races={races} seasonChampion={seasonChampion} />
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default SeasonDetails; 