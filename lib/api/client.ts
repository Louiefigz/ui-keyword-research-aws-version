import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiResponse } from '@/types/api.types';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000, // Reduced from 30s to 10s to prevent hanging
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'test-user-123', // Mock authentication header as per API docs
  },
  // Accept 202 status as success
  validateStatus: (status) => {
    return status >= 200 && status < 300; // Default is < 300, includes 202
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (future implementation)
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          // Unauthorized access
          // Redirect to login or refresh token
          break;
        case 403:
          // Forbidden access
          break;
        case 404:
          // Resource not found
          break;
        case 422:
          // Validation error
          break;
        case 500:
          // Server error
          break;
      }
    } else if (error.request) {
      // Network error
    }

    return Promise.reject(error);
  }
);