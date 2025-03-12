"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organization_id: number | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      // Don't attempt to load user if auth is still loading or not authenticated
      if (authLoading || !isAuthenticated) {
        if (!authLoading && !isAuthenticated) {
          // If auth is done loading and user is not authenticated, set loading to false
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [isAuthenticated, authLoading]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 