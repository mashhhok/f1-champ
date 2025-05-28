'use client';

import { Modal, Box, Alert } from "@mui/material";
import { useSelector } from 'react-redux';
import { selectDriverModalState } from '../../../redux/slices/racesSlice';
import { useRacesActions } from '../hooks';
import { getStyles } from '../styles';
import { useStyles } from '../../../hooks/useStyles';
import Driver from '../../driver';

const DriverModal = () => {
  const styles = useStyles(getStyles);
  const { closeModal } = useRacesActions();
  
  // Use memoized selector for better performance
  const { isOpen, driverInfo } = useSelector(selectDriverModalState);

  const renderModalContent = () => {
    if (!driverInfo) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="error">
            Driver information not available. Please try again.
          </Alert>
        </Box>
      );
    }

    return <Driver {...driverInfo} />;
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="driver-modal"
      aria-describedby="driver-information"
      sx={styles.modal}
    >
      <Box>
        {renderModalContent()}
      </Box>
    </Modal>
  );
};

export default DriverModal; 