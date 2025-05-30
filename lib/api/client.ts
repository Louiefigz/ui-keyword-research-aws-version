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

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.status === 404) {
      return 'Resource not found';
    }
    if (error.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'An unexpected error occurred';
};

// Type-safe API request wrapper
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: unknown,
  config?: import('axios').AxiosRequestConfig
): Promise<T> {
  try {
    let response;
    if (method === 'get' || method === 'delete') {
      response = await apiClient[method](url, config);
    } else {
      response = await apiClient[method](url, data, config);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}