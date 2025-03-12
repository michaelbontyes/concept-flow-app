import axios, { AxiosError } from 'axios';
import { LoginCredentials, Token } from '@/types/auth';

// Use relative URL for API endpoints since we're using Next.js rewrites
const API_URL = '/api/v1';

// Helper to check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Only try to access localStorage in a browser environment
    if (isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenData = JSON.parse(token) as Token;
        config.headers.Authorization = `Bearer ${tokenData.access_token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<Token> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Login failed:', error.response.data);
          throw new Error(error.response.data.detail || 'Login failed');
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response from server:', error.request);
          throw new Error('Unable to reach the server. Please check your connection.');
        }
      }
      // Something happened in setting up the request that triggered an Error
      console.error('Login error:', error);
      throw error;
    }
  },
  
  refreshToken: async (): Promise<Token> => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },
  
  getUserProfile: async () => {
    try {
      // This endpoint is not specified in the OpenAPI doc, but would typically 
      // be implemented. For now, we'll leave it as a placeholder.
      // Return a mock user for development purposes
      return {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
        organization_id: 1
      };
    } catch (error) {
      console.error('Get user profile failed:', error);
      throw error;
    }
  },
}; 