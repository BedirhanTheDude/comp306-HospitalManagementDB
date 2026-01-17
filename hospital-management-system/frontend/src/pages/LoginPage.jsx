import React from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Stack
} from '@mui/material';

const LoginPage = ({ role, goToSignup, goToWelcome, goToHome }) => {

    //------------INSERT BACKEND CALL HERE ---------------
      const handleLogin = async () => {
        //hardcoded true for now, else call verifyLogin
        const success = true;

        if (success) {
          goToHome();
        } else {
          setError('Invalid username or password');
        }
      };

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
            <TextField
              label="Username"
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
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
              <Button
                variant="outlined"
                fullWidth
                onClick={goToSignup}
              >
                Sign Up
              </Button>
            )}

            <Button
              variant="text"
              fullWidth
              onClick={goToWelcome}
            >
              Back to Welcome
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
