"use client";

import { Box, Container, Typography, Link } from "@mui/material";
import { BACKGROUND_LIGHT, BACKGROUND_DARK } from "../../styles/colors";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        py: 3,
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? BACKGROUND_LIGHT : BACKGROUND_DARK,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} F1 Project. Made with love by <Link href="https://github.com/mashhhok" target="_blank" rel="noopener noreferrer">Mariia Riabikova</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
