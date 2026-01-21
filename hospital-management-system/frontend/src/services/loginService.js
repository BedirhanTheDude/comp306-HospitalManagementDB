import api from './api';

/**
 * Login user
 * @param {{ username: string, password: string, role?: string }} loginRequest
 */
export const loginUser = async (loginRequest) => {
  try {
    const response = await api.post('/login', loginRequest);
    const data = response.data;

    if (data.success) {
      // Persist role
      if (data.role) {
        localStorage.setItem('role', data.role);
      }

      // Doctor login
      if (data.doctorId) {
        localStorage.setItem('doctor_id', data.doctorId);
      }

      // Patient login
      if (data.ssn) {
        localStorage.setItem('patientSSN', data.ssn);
        localStorage.setItem('patientFullName', data.fullName || '');
        localStorage.setItem('patientGender', data.gender || '');
      }
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed. Please try again.',
    };
  }
};
