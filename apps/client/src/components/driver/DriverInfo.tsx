import React from 'react';
import { Typography } from "@mui/material";
import { getStyles } from './styles';
import { useStyles } from '../../hooks/useStyles';

interface DriverInfoProps {
  label: string;
  value: string;
}

const DriverInfo = ({ label, value }: DriverInfoProps) => {
  const styles = useStyles(getStyles);
  
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