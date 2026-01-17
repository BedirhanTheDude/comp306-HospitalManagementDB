import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
} from '@mui/material';

const WelcomePage = ({ onSelectRole }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f4f6f8',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          width: 420,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Please choose how you want to Log in
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSelectRole('DOCTOR')}
          >
            Log in as Doctor
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => onSelectRole('PATIENT')}
          >
            Log in as Patient
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => onSelectRole('ADMIN')}
          >
            Log in as Admin
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default WelcomePage;
