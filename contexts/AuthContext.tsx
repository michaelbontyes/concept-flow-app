'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, Token, User } from '@/types/auth';
import { authApi } from '@/lib/api';

// Helper to check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe localStorage functions
const getStorageItem = (key: string): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
};

const setStorageItem = (key: string, value: string): void => {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
};

const removeStorageItem = (key: string): void => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Only run on client side
    if (!isBrowser) return;
    
    const initializeAuth = async () => {
      try {
        const storedToken = getStorageItem('token');
        if (!storedToken) {
          setState({ ...initialState, isLoading: false });
          return;
        }

        const token = JSON.parse(storedToken) as Token;
        
        // Get user profile using the token
        const user = await authApi.getCurrentUser();
        
        setState({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        removeStorageItem('token');
        setState({ ...initialState, isLoading: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true });
    
    try {
      const token = await authApi.login(credentials);
      setStorageItem('token', JSON.stringify(token));
      
      // Get user profile
      const user = await authApi.getCurrentUser();
      
      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setState({ ...initialState, isLoading: false });
      throw error;
    }
  };

  const logout = () => {
    removeStorageItem('token');
    setState({ ...initialState, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 