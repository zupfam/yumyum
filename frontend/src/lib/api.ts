import axios from 'axios';
import log from './logger';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token and Correlation ID to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add Correlation ID
  const requestId = crypto.randomUUID();
  config.headers['X-Request-ID'] = requestId;
  
  log.info('api_request', config.method || 'unknown', {
    url: config.url,
    requestId,
    params: config.params,
  });
  
  return config;
});

// Interceptor to log responses
api.interceptors.response.use(
  (response) => {
    log.info('api_response', response.config.method || 'unknown', {
      url: response.config.url,
      status: response.status,
      requestId: response.config.headers['X-Request-ID'],
    });
    return response;
  },
  (error) => {
    const requestId = error.config?.headers?.['X-Request-ID'];
    log.error('api_error', error.config?.method || 'unknown', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      requestId,
    });
    return Promise.reject(error);
  }
);

export default api;
