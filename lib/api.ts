"use client";

import axios, { AxiosError } from 'axios';
import { LoginCredentials, Token } from '@/types/auth';
import { Project } from '@/types/project';

// Use relative URL for API endpoints since we're using Next.js rewrites
const API_URL = '/api/v1';

// Helper to check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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
      
      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store the token in localStorage
      localStorage.setItem('token', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Login failed:', error.response.data);
          throw new Error(error.response.data.detail || 'Login failed');
        } else if (error.request) {
          console.error('No response from server:', error.request);
          throw new Error('Unable to reach the server. Please check your connection.');
        }
      }
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  refreshToken: async (): Promise<Token> => {
    try {
      const response = await apiClient.post('/auth/refresh');
      localStorage.setItem('token', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user profile failed:', error);
      throw error;
    }
  },
};

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function api(endpoint: string, options: ApiOptions = {}) {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

export const projectApi = {
  getProjects: async (organizationId: string | number): Promise<Project[]> => {
    try {
      const response = await apiClient.get(`/organizations/${organizationId}/projects`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },

  getProject: async (organizationId: string | number, projectId: string | number): Promise<Project> => {
    try {
      const response = await apiClient.get(`/organizations/${organizationId}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch project ${projectId}:`, error);
      throw error;
    }
  },

  createProject: async (organizationId: string | number, data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    try {
      const response = await apiClient.post(`/organizations/${organizationId}/projects`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },

  updateProject: async (organizationId: string | number, projectId: string | number, data: Partial<Project>): Promise<Project> => {
    try {
      const response = await apiClient.patch(`/organizations/${organizationId}/projects/${projectId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update project ${projectId}:`, error);
      throw error;
    }
  },

  deleteProject: async (organizationId: string | number, projectId: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/organizations/${organizationId}/projects/${projectId}`);
    } catch (error) {
      console.error(`Failed to delete project ${projectId}:`, error);
      throw error;
    }
  },
}; 