import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

const LoginPage = ({ goToSignup }) => {
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
          width: 360,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Identity Number"
          margin="normal"
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          margin="normal"
          fullWidth
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={goToSignup}
        >
          Don’t have an account? Sign Up
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
