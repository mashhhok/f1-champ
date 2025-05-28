'use client';

import React from 'react';
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Typography,
  Box,
  useTheme
} from "@mui/material";
import { DriverProps } from "./types"
import f1LogoRed from '../../assets/images/f1_logo_red.svg'
import { getStyles, formatDate } from './styles';
import DriverInfo from './DriverInfo';

const Driver = ({
  name, 
  surname,
  nationality, 
  dateOfBirth, 
  wikipediaUrl,
  permanentNumber,
  team
}: DriverProps) => {
  const theme = useTheme();
  const styles = getStyles();

  return (
    <Card sx={styles.card}>
      <Box sx={styles.teamIndicator(team)} />
      <Image
        src={f1LogoRed}
        alt={`${name} ${surname}`}
        width={100}
        height={100}
        style={{ 
          width: '100%', 
          height: '100px', 
          objectFit: 'cover' as const 
        }}
      />
      <CardContent>
        <Box>
          <Typography variant="h5" component="div" sx={styles.name}>
            {name} {surname}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            #{permanentNumber}
          </Typography>
        </Box>
        
        <Box sx={styles.infoContainer}>
          <DriverInfo label="Team" value={team} />
          <DriverInfo label="Nationality" value={nationality} />
          <DriverInfo label="Date of Birth" value={formatDate(dateOfBirth)} />
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component="a" 
          href={wikipediaUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          sx={styles.button}
        >
          Read more on Wikipedia
        </Button>
      </CardActions>
    </Card>
  );
};

export default Driver;
