import api from './api';
import { createLoginRequest } from '../types/api';

/**
 * Login user with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const loginUser = async (username, password) => {
  try {
    const request = createLoginRequest(username, password);
    const response = await api.post('/login', request);

    // Save user info to localStorage on successful login
    if (response.data.success) {
      localStorage.setItem('patientSSN', response.data.ssn || '');
      localStorage.setItem('patientFullName', response.data.fullName || '');
      localStorage.setItem('patientGender', response.data.gender || '');
    }

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed. Please try again.',
    };
  }
};