'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  avatarUrl: string;
  organization?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authAxios: any;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const authAxios = React.useMemo(() => {
    const instance = axios.create();
    instance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return instance;
  }, [accessToken]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        return storedToken;
      }
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    return null;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshAccessToken();
      setLoading(false);
    };
    initializeAuth();
  }, [refreshAccessToken]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      
      if (response.data.access_token) {
        const { access_token, role } = response.data;
        
        const loggedUser: User = {
          id: 'USR001',
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: role,
          avatarUrl: ''
        };
        
        setAccessToken(access_token);
        setUser(loggedUser);
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        
        toast.success(`Welcome back, ${loggedUser.name}!`);

        if (role === 'Admin' || role === 'Manager') {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Failed to login. Please try again.';
      toast.error(errorMsg);
      return false;
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        authAxios,
        refreshAccessToken,
      }}
    >
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
