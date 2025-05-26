import { F1_RED, F1_WHITE } from "../../styles/colors";
import { Theme } from "@mui/material";

// Styles for the Races Table component
export const getStyles = (theme: Theme) => {
  return {
    tableContainer: {
      width: '100%', 
      borderRadius: 2, 
      overflow: 'hidden'
    },
    tableHead: {
      backgroundColor: F1_RED
    },
    headerCell: {
      color: F1_WHITE, 
      fontFamily: '"Formula1", sans-serif', 
      fontWeight: 500,
      fontSize: { xs: '0.75rem', md: '0.875rem' }
    },
    bodyCell: {
      fontFamily: '"Formula1", sans-serif',
      fontSize: { xs: '0.75rem', md: '0.875rem' }
    },
    winnerCell: {
      cursor: 'pointer',
      '&:hover': { 
        textDecoration: 'underline', 
        color: F1_RED 
      }
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4
    }
  };
};

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
}; 