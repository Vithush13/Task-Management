'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '../lib/authService';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await AuthService.login(data);
      setUser(response);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await AuthService.register(data);
      // Show success message and redirect to login
      router.push('/login?registered=true');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};