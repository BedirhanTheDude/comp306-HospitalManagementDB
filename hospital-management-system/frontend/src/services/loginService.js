import api from './api';

export const loginUser = async (loginRequest) => {
  try {
    const response = await api.post('/login', loginRequest);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed. Please try again. Service error.',
    };
  }
};