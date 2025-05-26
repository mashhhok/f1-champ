"use client";

import { useTheme } from "next-themes";
import { GlobalStyles } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, globalStyles, lightTheme } from "../../app/theme/theme";
import { FC, useEffect, useState } from "react";

const MUIThemeProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(darkTheme);
  const [mounted, setMounted] = useState(false);

  // Prevent theme flickering
  useEffect(() => {
    // Add CSS to prevent flash during theme change
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(`
      *,
      *::before,
      *::after {
        transition: background-color 0.2s ease-out, color 0.2s ease-out !important;
      }
    `));
    document.head.appendChild(style);
    setMounted(true);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      resolvedTheme === "light"
        ? setCurrentTheme(lightTheme)
        : setCurrentTheme(darkTheme);
    }
  }, [resolvedTheme, mounted]);

  // Prevent rendering until mounted to avoid mismatch
  if (!mounted) {
    return <></>;
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
};

export default MUIThemeProvider;