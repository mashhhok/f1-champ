import { PaletteOptions, createTheme, css } from "@mui/material/styles";
import { 
  F1_RED, 
  F1_BLACK, 
  F1_WHITE, 
  BACKGROUND_LIGHT, 
  BACKGROUND_DARK, 
  PAPER_LIGHT, 
  PAPER_DARK,
  TEXT_PRIMARY_LIGHT,
  TEXT_PRIMARY_DARK,
  TEXT_SECONDARY_LIGHT,
  TEXT_SECONDARY_DARK
} from "../../styles/colors";

export type AllowedTheme = NonNullable<PaletteOptions["mode"]>;

export const DEFAULT_THEME: AllowedTheme = "dark";

export const baseTheme = {
  typography: {
    fontFamily: '"Formula1", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      fontFamily: '"Formula1", sans-serif',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      fontFamily: '"Formula1", sans-serif',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      fontFamily: '"Formula1", sans-serif',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      fontFamily: '"Formula1", sans-serif',
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: '"Formula1", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: F1_RED,
      light: '#ff3d3d',
      dark: '#a70000',
    },
    secondary: {
      main: F1_BLACK,
      light: '#424242',
      dark: '#000000',
    },
    background: {
      default: BACKGROUND_LIGHT,
      paper: PAPER_LIGHT,
    },
    text: {
      primary: TEXT_PRIMARY_LIGHT,
      secondary: TEXT_SECONDARY_LIGHT,
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: F1_RED,
      light: '#ff3d3d',
      dark: '#a70000',
    },
    secondary: {
      main: F1_WHITE,
      light: '#E0E0E0',
      dark: '#BDBDBD',
    },
    background: {
      default: BACKGROUND_DARK,
      paper: PAPER_DARK,
    },
    text: {
      primary: TEXT_PRIMARY_DARK,
      secondary: TEXT_SECONDARY_DARK,
    },
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
}); 

export const globalStyles = css`
  :root {
    body {
      background-color: ${F1_WHITE};
      color: ${BACKGROUND_DARK};
    }
  }

  [data-theme="dark"] {
    body {
      background-color: ${BACKGROUND_DARK};
      color: ${F1_WHITE};
    }
  }
`;