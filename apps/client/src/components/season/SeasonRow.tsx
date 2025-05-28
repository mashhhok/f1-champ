import {
  TableRow,
  TableCell,
  useTheme
} from "@mui/material";
import { SeasonRowProps } from "./types";
import { getStyles } from './styles';

const SeasonRow = ({ season, isSelected, onClick }: SeasonRowProps) => {
  const theme = useTheme();
  const styles = getStyles();
  
  return (
    <TableRow 
      hover
      onClick={onClick}
      sx={styles.seasonRow(isSelected)}
    >
      <TableCell sx={styles.seasonYearCell}>{season.year}</TableCell>
      <TableCell sx={styles.seasonChampionCell}>{season.champion}</TableCell>
    </TableRow>
  );
};

export default SeasonRow; 