import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Access Denied:', error.response.data);
    } else if (error.message === 'Network Error') {
      console.error('Network error - ensure backend is running on port 8080');
    }
    return Promise.reject(error);
  }
);

export default api;
