import api from './api';
import { createFindRequest } from '../types/api';

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

