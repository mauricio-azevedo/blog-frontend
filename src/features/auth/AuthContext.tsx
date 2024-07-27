import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../users/users.types';
import authEventEmitter from './AuthEventEmitter';

interface AuthContextType {
  isAuthenticated: () => boolean;
  authenticatedUser: User | null;
  login: (user: User, token: string) => void;
  onServerSignOut: () => void;
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
    if (authenticatedUser !== null) {
      localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
    } else {
      localStorage.removeItem('authenticatedUser');
    }
  }, [authenticatedUser]);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const onServerSignIn = (user: User, token: string) => {
    setAuthenticatedUser(user);
    localStorage.setItem('token', token);
    navigate('/posts');
  };

  const onServerSignOut = useCallback(async () => {
    setAuthenticatedUser(null);
    localStorage.removeItem('token');
    navigate('/sign-in');
  }, [navigate]);

  useEffect(() => {
    authEventEmitter.on('logout', onServerSignOut);
    return () => {
      authEventEmitter.off('logout', onServerSignOut);
    };
  }, [onServerSignOut]);

  return (
    <AuthContext.Provider value={{ authenticatedUser, isAuthenticated, login: onServerSignIn, onServerSignOut }}>
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
