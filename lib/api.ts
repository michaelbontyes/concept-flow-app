"use client";

import axios, { AxiosError } from 'axios';
import { LoginCredentials, Token } from '@/types/auth';
import { Project } from '@/types/project';
import { Metadata } from '@/types/metadata';

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
      try {
        const tokenStr = localStorage.getItem('token');
        if (tokenStr) {
          // Log token for debugging
          console.log('Token found in localStorage');
          
          // Safely parse the token
          let tokenData: Token;
          try {
            tokenData = JSON.parse(tokenStr) as Token;
            
            if (tokenData && tokenData.access_token) {
              config.headers.Authorization = `Bearer ${tokenData.access_token}`;
              console.log('Authorization header set successfully');
            } else {
              console.error('Token exists but is missing access_token property:', tokenData);
            }
          } catch (parseError) {
            console.error('Failed to parse token from localStorage:', parseError);
            // If token is not valid JSON, remove it
            localStorage.removeItem('token');
          }
        } else {
          console.log('No token found in localStorage');
        }
      } catch (e) {
        console.error('Error accessing localStorage:', e);
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
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data || 'No data',
        headers: error.response.headers,
      });
      
      // Handle 401 Unauthorized errors (expired token)
      if (error.response.status === 401) {
        console.error('Authentication error - clearing token');
        localStorage.removeItem('token');
        // Optionally redirect to login
        if (isBrowser && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received:', {
        request: error.request,
        message: error.message,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
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
      // Check if token exists before making the request
      const tokenStr = localStorage.getItem('token');
      if (!tokenStr) {
        console.error('Cannot get current user: No token in localStorage');
        throw new Error('No authentication token found');
      }
      
      // Validate token format
      try {
        const tokenData = JSON.parse(tokenStr) as Token;
        if (!tokenData.access_token) {
          console.error('Invalid token format in localStorage');
          localStorage.removeItem('token'); // Remove invalid token
          throw new Error('Invalid authentication token');
        }
      } catch (e) {
        console.error('Failed to parse token:', e);
        localStorage.removeItem('token');
        throw new Error('Invalid authentication token format');
      }
      
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user profile failed:', error);
      // If it's a 401, clear the token
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Unauthorized - clearing token');
        localStorage.removeItem('token');
      }
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
    let retries = 2; // Number of retries for network issues
    
    while (retries >= 0) {
      try {
        console.log(`Fetching projects for organization ${organizationId}`);
        const response = await apiClient.get(`/organizations/${organizationId}/projects`);
        console.log('Projects fetched successfully');
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          // If it's a server error (5xx) or network error and we have retries left
          if ((!error.response || (error.response && error.response.status >= 500)) && retries > 0) {
            console.log(`Retrying project fetch, ${retries} attempts left`);
            retries--;
            // Wait before retrying (exponential backoff)
            await new Promise(r => setTimeout(r, (2 - retries) * 1000));
            continue;
          }
          
          // Handle 401/403 errors by redirecting to login
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Authentication error when fetching projects');
            localStorage.removeItem('token');
            if (isBrowser && window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
        
        console.error('Failed to fetch projects:', error);
        throw error;
      }
    }
    
    throw new Error('Failed to fetch projects after retries');
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

export const metadataApi = {
  listMetadata: async (projectId: number | string, metadataType?: string): Promise<Metadata[]> => {
    try {
      const params = metadataType ? { metadata_type: metadataType } : undefined;
      const response = await apiClient.get(`/projects/${projectId}/metadata`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      throw error;
    }
  },

  getMetadata: async (projectId: number | string, metadataId: number | string): Promise<Metadata> => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/metadata/${metadataId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch metadata ${metadataId}:`, error);
      throw error;
    }
  },

  createMetadata: async (projectId: number | string, data: Omit<Metadata, 'id' | 'created_at' | 'updated_at'>): Promise<Metadata> => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/metadata`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create metadata:', error);
      throw error;
    }
  },

  updateMetadata: async (projectId: number | string, metadataId: number | string, data: Partial<Metadata>): Promise<Metadata> => {
    try {
      const response = await apiClient.patch(`/projects/${projectId}/metadata/${metadataId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update metadata ${metadataId}:`, error);
      throw error;
    }
  },
}; 