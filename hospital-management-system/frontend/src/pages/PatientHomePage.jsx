import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const PatientHome = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patient Dashboard
      </Typography>

      <Typography>
        Welcome, patient! This is your home page.
      </Typography>
    </Box>
  );
};

export default PatientHome;
