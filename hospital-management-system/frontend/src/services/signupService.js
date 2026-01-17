import api from './api';

export const signupPatient = (signupRequest) => api.post('/signup', signupRequest);