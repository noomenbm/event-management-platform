/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const DEFAULT_USER = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'light',
  },
  favoriteEvents: [],
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      setIsAuthLoading(true);
      setAuthError(null);

      try {
        const user = await api.getUser(DEFAULT_USER.id);

        if (isMounted) {
          setCurrentUser({ ...DEFAULT_USER, ...user });
        }
      } catch (err) {
        if (isMounted) {
          setAuthError(err.message || 'Unable to load user profile.');
          setCurrentUser(DEFAULT_USER);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateCurrentUser = (updates) => {
    setCurrentUser((user) => ({
      ...user,
      ...updates,
      preferences: {
        ...user.preferences,
        ...updates.preferences,
      },
    }));
  };

  const value = useMemo(() => ({
    currentUser,
    userId: currentUser.id,
    isAuthLoading,
    authError,
    updateCurrentUser,
  }), [authError, currentUser, isAuthLoading]);

  return (
    <AuthContext.Provider value={value}>
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
