import { TableCell, useTheme } from "@mui/material";
import { Race, TableColumn } from "../types";
import { getStyles } from '../styles';
import { useRenderCellContent } from '../hooks/useRenderCellContent';

interface RaceTableCellProps {
  race: Race;
  column: TableColumn;
  seasonChampion?: string;
}

const RaceTableCell = ({ race, column, seasonChampion }: RaceTableCellProps) => {
  const theme = useTheme();
  const styles = getStyles();

  const renderCellContent = useRenderCellContent({column, race, seasonChampion});

  return (
    <TableCell 
      sx={{ 
        ...styles.bodyCell,
        ...(column.hideOnXs && { display: { xs: 'none', sm: 'table-cell' } }),
        ...(column.hideOnSm && { display: { xs: 'none', md: 'table-cell' } }),
        ...(column.id === 'winner' && { fontWeight: 500 })
      }}
    >
      {renderCellContent()}
    </TableCell>
  );
};

export default RaceTableCell; 