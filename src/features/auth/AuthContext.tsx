import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../users/users.types';
import authEventEmitter from './AuthEventEmitter';
import { message as antdMessage } from 'antd';

interface AuthContextType {
  isAuthenticated: () => boolean;
  authenticatedUser: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const fetchAuthenticatedUser = (): User | null => {
  const storedAuthenticated = localStorage.getItem('authenticatedUser');
  return storedAuthenticated ? JSON.parse(storedAuthenticated) : null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(fetchAuthenticatedUser());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
  }, [authenticatedUser]);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const login = (user: User, token: string) => {
    setAuthenticatedUser(user);
    localStorage.setItem('token', token);
    navigate('/posts');
  };

  const logout = useCallback(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authenticatedUser');
    antdMessage.success('Signed out successfully');
    navigate('/sign-in');
  }, [navigate]);

  useEffect(() => {
    authEventEmitter.on('logout', logout);
    return () => {
      authEventEmitter.off('logout', logout);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ authenticatedUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
