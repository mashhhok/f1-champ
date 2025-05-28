import { F1_RED, F1_WHITE } from "../../styles/colors";

// Styles for the Season Table component
export const getStyles = () => {
  return {
    tableContainer: {
      maxWidth: 1000,
      mx: 'auto',
      mt: 4,
      borderRadius: 2,
      overflow: 'hidden'
    },
    tableHead: {
      backgroundColor: F1_RED
    },
    headerCell: {
      color: F1_WHITE,
      fontFamily: '"Formula1", sans-serif',
      fontWeight: 600,
      fontSize: '1rem'
    },
    seasonRow: (isSelected: boolean) => ({
      cursor: 'pointer',
      backgroundColor: isSelected ? `${F1_RED}10` : 'inherit',
      '&:hover': {
        backgroundColor: isSelected ? `${F1_RED}15` : `${F1_RED}05`
      }
    }),
    seasonYearCell: {
      fontFamily: '"Formula1", sans-serif',
      fontWeight: 700
    },
    seasonChampionCell: {
      fontFamily: '"Formula1", sans-serif'
    },
    racesCell: {
      padding: 0,
      border: 0
    },
    racesContainer: {
      py: 3,
      px: 2
    },
    racesTitle: {
      fontFamily: '"Formula1", sans-serif',
      fontWeight: 500,
      mb: 2,
      textAlign: 'center'
    }
  };
}; 