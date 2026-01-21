import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import { loginUser } from '../services/loginService';

const LoginPage = ({ role, goToSignup, goToWelcome, goToHome }) => {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    const request = {
      fullName,
      password,
      role
    };

    const response = await loginUser(request);

    if (response && response.success) {
      localStorage.setItem('auth_role', role);
      if (response.doctorId) {
        localStorage.setItem('doctor_id', String(response.doctorId));
      }
      goToHome();
    } else {
      setError(response?.error || 'Login failed. Please try again.');
    }
  };

  // Role'a göre label ve placeholder
  const usernameLabel = role === 'DOCTOR' ? 'Email/Username' : 'Full Name';
  const usernamePlaceholder =
    role === 'DOCTOR' ? 'Enter your email or username' : 'Enter your full name';

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Logging in as <strong>{role}</strong>
          </Typography>

          <Stack spacing={2} mt={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label={usernameLabel}
              placeholder={usernamePlaceholder}
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
            >
              Login
            </Button>

            {/* Patient-only signup */}
            {role === 'PATIENT' && (
              <Button variant="outlined" fullWidth onClick={goToSignup}>
                Sign Up
              </Button>
            )}

            <Button variant="text" fullWidth onClick={goToWelcome}>
              Back to Welcome
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
