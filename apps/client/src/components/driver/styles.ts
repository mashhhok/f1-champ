import { F1_RED, getTeamColor } from "../../styles/colors";

export const getStyles = () => ({
  card: {
    maxWidth: 345,
    borderRadius: 2,
    overflow: 'hidden'
  },
  media: {
    height: '200px',
    objectFit: 'cover'
  },
  name: {
    fontFamily: '"Formula1", sans-serif',
    fontWeight: 700
  },
  infoContainer: {
    mt: 2
  },
  infoText: {
    mb: 0.5
  },
  button: {
    fontSize: '0.6rem',
    color: F1_RED
  },
  teamIndicator: (team: string) => ({
    width: '100%',
    height: '5px',
    backgroundColor: getTeamColor(team)
  })
});

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
}; 