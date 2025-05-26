"use client";

import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import ThemeSwitch from "../styles/ThemeSwitch";

const ThemeUpdater: FC<{}> = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client we can show UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ThemeSwitch
        checked={resolvedTheme === 'dark'}
        onChange={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      />
    </Box>
  );
};

export default ThemeUpdater;