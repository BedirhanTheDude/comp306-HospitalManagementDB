import api from './api';
import { createSignUpRequest } from '../types/api';

/**
 * Register a new patient
 * @param {Object} params
 * @param {string} params.identityNumber - 11-digit identity number
 * @param {string} params.fullName - Patient's full name
 * @param {string} params.gender - 'M' or 'F'
 * @param {string} params.phoneNumber - Phone number
 * @param {string} params.dateOfBirth - Date of birth (YYYY-MM-DD)
 * @param {string} params.password - Password
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const signupPatient = async (params) => {
  try {
    const request = createSignUpRequest(params);
    const response = await api.post('/signup', request);

    // Save user info to localStorage on successful signup
    if (response.data.success) {
      localStorage.setItem('patientSSN', params.identityNumber || '');
      localStorage.setItem('patientFullName', params.fullName || '');
      localStorage.setItem('patientGender', params.gender || '');
    }

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Signup failed. Please try again.',
    };
  }
};