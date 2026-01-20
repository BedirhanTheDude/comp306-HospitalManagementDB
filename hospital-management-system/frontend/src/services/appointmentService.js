import api from './api';
import { createAppointmentRequest, createDoctorSearchRequest } from '../types/api';

//filter data

export const getPoliclinics = async () => {
  try {
    const response = await api.get('/doctor-filters/policlinics');
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not fetch policlinics. Please try again.',
    };
  }
};

export const getCities = async () => {
  try {
    const response = await api.get('/doctor-filters/cities');
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not fetch cities. Please try again.',
    };
  }
};

//filtering


/**
 * Filter and fetch doctors
 * Backend: AppointmentController.searchDoctors -> returns List<DoctorSearchResponse>
 * @param {Object} params
 * @param {string} params.policlinicName - Selected policlinic name
 * @param {string} params.cityName - Selected city name
 * @param {number} params.minRating - Minimum doctor rating (1-5)
 * @param {number} params.maxRating - Maximum doctor rating (1-5)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const fetchDoctors = async (params) => {
  try {
    const request = createDoctorSearchRequest(params);
    const response = await api.post('/appointments/search/doctors', request);
    // Backend returns List<DoctorSearchResponse> directly, wrap it
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not fetch doctors. Please try again.',
    };
  }
};

// appointment
/**
 * Book an appointment
 * @param {Object} params
 * @param {number} data.year - Appointment year
 * @param {number} data.month - Appointment month
 * @param {number} data.day - Appointment day
 * @param {number} data.hour - Appointment hour
 * @param {number} data.minute - Appointment minute
 * @param {number} data.patientSSN - Patient's identity number
 * @param {number} data.doctorID - Doctor's ID
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const bookAppointment = async (params) => 
{try {
    const request = createAppointmentRequest(params);
    const response = await api.post('/appointments/create', request);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Could not make appointment. Please try again.',
    };
  }};

export const getAppointments = () => api.get('/appointments');
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
