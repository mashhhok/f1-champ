"use client";

import { AppBar, Toolbar, Link, Box } from "@mui/material"
import Image from "next/image"
import f1Logo from '../../assets/images/f1_logo.svg'
import ThemeUpdater from "../ThemeUpdater";

export const Header = () => {

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" component="a">
          <Image
            src={f1Logo}
            alt="Formula 1 logo"
            width={48}
            height={12}
            className="hover:cursor-pointer hidden xs:block"
            priority
          />
        </Link>
        <Box>
          <ThemeUpdater />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
