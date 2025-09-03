import { useState, useEffect, createContext, useContext } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        apiService.setToken(token);
        const userData = await apiService.getCurrentUser();
        setUser(userData.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      apiService.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      // After receiving token, fetch full current user so we have interests/phone/location
      const current = await apiService.getCurrentUser();
      setUser(current.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, role = 'volunteer', interests = undefined) => {
    try {
      const response = await apiService.register(name, email, password, role, interests);
      console.log('Register response:', response);
      
      if (response.message === 'User registered successfully') {
        return response;
      }
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.message && response.message !== 'User registered successfully') {
        throw new Error(response.message);
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      if (error.message.includes('Server error')) {
        throw new Error('Registration completed but there was an issue with email verification. You can still sign in.');
      }
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    const response = await apiService.updateProfile(profileData);
    if (response && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const refreshUser = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      if (userData && userData.user) setUser(userData.user);
    } catch (e) {
      console.error('Refresh user failed:', e);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    updateProfile,
    refreshUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};