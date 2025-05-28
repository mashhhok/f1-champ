import { TableHead, TableRow, TableCell } from "@mui/material";
import { TableColumn } from "../types";
import { getStyles } from '../styles';
import { useStyles } from '../../../hooks/useStyles';

interface RaceTableHeaderProps {
  columns: TableColumn[];
}

const RaceTableHeader = ({ columns }: RaceTableHeaderProps) => {
  const styles = useStyles(getStyles);

  return (
    <TableHead sx={styles.tableHead}>
      <TableRow>
        {columns.map((column) => (
          <TableCell 
            key={column.id}
            sx={{ 
              ...styles.headerCell,
              ...(column.hideOnXs && { display: { xs: 'none', sm: 'table-cell' } }),
              ...(column.hideOnSm && { display: { xs: 'none', md: 'table-cell' } })
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default RaceTableHeader; 