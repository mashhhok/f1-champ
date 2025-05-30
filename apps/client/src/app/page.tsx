import type { Metadata } from "next";
import { Header } from '../components/ui/Header';
import { Footer } from '../components/ui/Footer';
import { Typography, Box, Container } from "@mui/material";
import SeasonsContainer from '../components/SeasonsContainer';

export const metadata: Metadata = {
  title: "F1 Champions",
  description: "Formula 1 Champions History",
}; 

export default function Index() {

  return (
    <div>
      <div className="wrapper">
        <Header />
        <Container maxWidth="lg" sx={{ mt: 6, mb: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" component="h1" 
              sx={{ 
                fontFamily: '"Formula1", sans-serif', 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2
              }}
            >
              FORMULA 1 RACE WINNERS {process.env.NEXT_PUBLIC_API_URL}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SeasonsContainer />
          </Box>
        </Container>
        <Footer />
      </div>
    </div>
  );
}
