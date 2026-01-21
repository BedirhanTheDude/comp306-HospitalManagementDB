import api from './api';
import { createFindRequest, createReviewRequest } from '../types/api';

/**
 * Find appointments
 * @param {Object} params
 * @param {number} data.patientSSN - Patient's identity number
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const listTestResults = async (patientSSN) =>
{try {
    const request = createFindRequest({ patientSSN: Number(patientSSN) });
    const response = await api.post('/tests/results', request);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not find test results. Please try again.',
    };
  }
};

export const deleteTestResult = async (testID) => {
  try {
    const response = await api.post('/tests/delete', { testID });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not delete test result. Please try again.',
    };
  }
};
// Create review request
/**
 * @param {Object} params
 * @param {number} params.appointmentID
 * @param {number} params.rating
 * @param {string} params.comment
 * @returns {Object} 
 */
export const reviewAppointment = async (params) => {
  try {
    const request = createReviewRequest(params);
    const response = await api.post('/reviews/new', request);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not submit review. Please try again.',
    };
  }
};

//get notification for blood test

/**
 * @param {Object} params
 * @param {number} data.patientSSN - Patient's identity number
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const getBloodTestWarning = async (patientSSN) => {
  try {
    const response = await api.get('/notifications/test', {
      params: { patientssn: Number(patientSSN) }
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not fetch warning for blood tests.',
    };
  }
};

export const getEpidemicsWarning = async () => {
  try {
    const response = await api.get('/notifications/epidemics');
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not fetch warning for epidemics.',
    };
  }
};

/**
 * @param {number} patientSSN - Patient's identity number
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getDiscountNotification = async (patientSSN) => {
  try {
    const response = await api.get('/notifications/discounts', {
      params: { patientssn: Number(patientSSN) }
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not fetch notification for discount.',
    };
  }
};


