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
              FORMULA 1
            </Typography>
            <Typography variant="h3" 
              sx={{ 
                fontFamily: '"Formula1", sans-serif', 
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              World Champions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Typography variant="body1" 
              sx={{ 
                maxWidth: 800,
                fontFamily: '"Formula1", sans-serif', 
                fontWeight: 400
              }}
            >
              Explore the rich history of Formula 1 racing and discover the champions who 
              have defined the pinnacle of motorsport throughout the decades. From legendary 
              drivers to iconic teams, this interactive platform brings the excitement and 
              legacy of Formula 1 to life.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 1000 }}>
              <Typography variant="h5" component="h2" 
                sx={{ 
                  fontFamily: '"Formula1", sans-serif', 
                  fontWeight: 600,
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                World Champions by Season
              </Typography>
              <SeasonsContainer />
            </Box>
          </Box>
        </Container>
        <Footer />
      </div>
    </div>
  );
}
