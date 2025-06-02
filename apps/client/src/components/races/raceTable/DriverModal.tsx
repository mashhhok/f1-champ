'use client';

import { Modal, Box } from "@mui/material";
import { useSelector } from 'react-redux';
import { selectRacesState } from '../../../redux/slices/racesSlice';
import { useRacesActions } from '../hooks';
import { getStyles } from '../styles';
import { useStyles } from '../../../hooks/useStyles';
import Driver from '../../driver';

const DriverModal = () => {
  const styles = useStyles(getStyles);
  const { closeModal } = useRacesActions();
  
  // Get modal state from Redux - Driver component handles its own data
  const { isDriverModalOpen } = useSelector(selectRacesState);

  return (
    <Modal
      open={isDriverModalOpen}
      onClose={closeModal}
      aria-labelledby="driver-modal"
      aria-describedby="driver-information"
      sx={styles.modal}
    >
      <Box>
        <Driver />
      </Box>
    </Modal>
  );
};

export default DriverModal; 