import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../users/users.types';
import authEventEmitter from './AuthEventEmitter';

interface AuthContextType {
  isAuthenticated: () => boolean;
  authenticatedUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// TODO: Handle auth verification via API only, not localStorage

const fetchAuthenticated = (): User | null => {
  const storedAuthenticated: string | null = localStorage.getItem('authenticatedUser');
  return storedAuthenticated ? JSON.parse(storedAuthenticated) : null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(fetchAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
  }, [authenticatedUser]);

  const isAuthenticated = useCallback(() => {
    return !!fetchAuthenticated();
  }, []);

  const login = (user: User) => {
    setAuthenticatedUser(user);
    navigate('/posts');
  };

  const logout = useCallback(() => {
    setAuthenticatedUser(null);
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
