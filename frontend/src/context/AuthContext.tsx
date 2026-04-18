import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('codeforge_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('codeforge_user');
        localStorage.removeItem('codeforge_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const userData: User = {
      userId: res.data.userId,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      token: res.data.token,
    };
    localStorage.setItem('codeforge_token', userData.token);
    localStorage.setItem('codeforge_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authAPI.register({ name, email, password });
    const userData: User = {
      userId: res.data.userId,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      token: res.data.token,
    };
    localStorage.setItem('codeforge_token', userData.token);
    localStorage.setItem('codeforge_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('codeforge_token');
    localStorage.removeItem('codeforge_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
