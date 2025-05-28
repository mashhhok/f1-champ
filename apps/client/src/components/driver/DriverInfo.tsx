import React from 'react';
import { Typography, useTheme } from "@mui/material";
import { getStyles } from './styles';

interface DriverInfoProps {
  label: string;
  value: string;
}

const DriverInfo = ({ label, value }: DriverInfoProps) => {
  const theme = useTheme();
  const styles = getStyles();
  
  return (
    <Typography 
      variant="body2" 
      color="text.primary" 
      sx={styles.infoText}
    >
      <strong>{label} - </strong> {value}
    </Typography>
  );
};

export default DriverInfo; 