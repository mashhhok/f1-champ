import {
  TableRow,
  TableCell
} from "@mui/material";
import { SeasonRowProps } from "./types";
import { getStyles } from './styles';
import { useStyles } from '../../hooks/useStyles';

const SeasonRow = ({ season, isSelected, onClick }: SeasonRowProps) => {
  const styles = useStyles(getStyles);
  
  return (
    <TableRow 
      hover
      onClick={onClick}
      sx={styles.seasonRow(isSelected)}
    >
      <TableCell sx={styles.seasonYearCell}>{season.year}</TableCell>
      <TableCell sx={styles.seasonChampionCell}>
        {season.isSeasonEnded ? season.champion : "The season hasn't ended yet"}
      </TableCell>
    </TableRow>
  );
};

export default SeasonRow; 