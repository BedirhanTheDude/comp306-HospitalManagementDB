import api from './api';

export const signupPatient = async (signupRequest) => {
  try {
    const response = await api.post('/signup', signupRequest);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Signup failed. Please try again.',
    };
  }
};