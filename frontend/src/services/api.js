// API servis za komunikaciju sa backendom
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Kreiranje axios instance sa default konfiguracijom
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor za dodavanje tokena u zahtjeve
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor za rukovanje greškama
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error || error.message
    });
    
    if (error.response?.status === 401) {
      // Token je istekao ili neispravan
      console.log('🔒 401 Unauthorized - preusmjeravanje na login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API funkcije za korisnike
export const userAPI = {
  login: (username, password) => api.post('/users/login', { username, password }),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// API funkcije za frizere (koristi tabelu 'frizers')
export const frizerAPI = {
  getAll: () => api.get('/frizers'),
  getById: (id) => api.get(`/frizers/${id}`),
  create: (data) => api.post('/frizers', data),
  update: (id, data) => api.put(`/frizers/${id}`, data),
  delete: (id) => api.delete(`/frizers/${id}`)
};


// API funkcije za usluge
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

// API funkcije za rezervacije
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  getByDate: (date) => api.get(`/appointments/date/${date}`),
  getAvailableSlots: (serviceId, date) => 
    api.get('/appointments/available-slots', { params: { serviceId, date } }),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// API funkcije za frizere (barbers)
export const barberAPI = {
  getAll: () => api.get('/barbers'),
  getById: (id) => api.get(`/barbers/${id}`),
  create: (barberData) => api.post('/barbers', barberData),
  update: (id, barberData) => api.put(`/barbers/${id}`, barberData),
  delete: (id) => api.delete(`/barbers/${id}`),
};

export default api;
