import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

const SignupPage = ({ goToLogin }) => {
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
          p: 4,
          width: 400,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>

        <TextField label="Full Name" margin="normal" fullWidth />
        <TextField label="Identity Number" margin="normal" fullWidth />
        <TextField label="Email" margin="normal" fullWidth />
        <TextField label="Password" type="password" margin="normal" fullWidth />
        <TextField label="Confirm Password" type="password" margin="normal" fullWidth />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Account
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={goToLogin}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default SignupPage;
