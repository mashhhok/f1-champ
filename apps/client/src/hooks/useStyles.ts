import { useTheme } from "@mui/material";

/**
 * Custom hook that combines useTheme and getStyles functionality
 * @param getStylesFunction - A function that returns style objects, optionally taking theme as parameter
 * @returns The styles object returned by the getStyles function
 */
export const useStyles = <T>(getStylesFunction: (theme?: any) => T): T => {
  const theme = useTheme();
  return getStylesFunction(theme);
};

export default useStyles; 