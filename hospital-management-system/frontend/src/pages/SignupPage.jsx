import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material';
import { signupPatient } from '../services/signupService';

const SignupPage = ({ goToLogin, goToWelcome, goToHome }) => {
  const [fullName, setFullName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // ✅ Validate inputs
  const validInputs = () => {
    if (
      !fullName ||
      !identityNumber ||
      !gender ||
      !phoneNumber ||
      !birthDate ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all fields');
      return false;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid phone number');
        return false;
    }

    const identityRegex = /^[0-9]{9}$/;
    if (!identityRegex.test(identityNumber)) {
        setError('Identity number must be exactly 9 digits');
        return false;
    }


    const today = new Date();
    const dob = new Date(birthDate);

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 ||(monthDiff === 0 && today.getDate() < dob.getDate()))
        age--;

    if (age < 18) {
        setError('You must be at least 18 years old to sign up');
        return false;
    }

    const passwordRegex = /^(?=.*[\d\W]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one number or special character');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    setError('');
    return true;
  };

  // ------------ BACKEND CALL ---------------
  const handleSignup = async () => {
    if (!validInputs()) return;

    const request = {
      identityNumber,
      fullName,
      gender,
      phoneNumber,
      dateOfBirth: birthDate,
      username,
      password,
    };

    const response = await signupPatient(request);

    if (response && response.success) {
      goToHome();
    } else {
      setError(response?.error || 'Signup failed. Please try again.');
    }
  };

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

        <TextField
          label="Full Name"
          margin="normal"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <TextField
          label="Identity Number"
          margin="normal"
          fullWidth
          value={identityNumber}
          onChange={(e) => setIdentityNumber(e.target.value)}
        />

        <TextField
          label="Gender"
          select
          margin="normal"
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="M">Male</MenuItem>
          <MenuItem value="F">Female</MenuItem>
        </TextField>

        <TextField
          label="Phone Number"
          type="tel"
          margin="normal"
          fullWidth
          placeholder="+90 5XX XXX XXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <TextField
          label="Birth Date"
          type="date"
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <TextField
          label="Username"
          type="username"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          type="password"
          margin="normal"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignup}
        >
          Create Patient Account
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={goToLogin}
        >
          Back to Login
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={goToWelcome}
        >
          Back to Welcome
        </Button>
      </Paper>
    </Box>
  );
};

export default SignupPage;
