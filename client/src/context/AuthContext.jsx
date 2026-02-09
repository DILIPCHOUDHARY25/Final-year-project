import { createContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/utils.js';

const AuthContext = createContext(null);

const getInitialState = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  if (storedUser && storedToken) {
    const parsedUser = JSON.parse(storedUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    return { user: parsedUser, loading: false };
  }
  return { user: null, loading: false };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialState();
  const [user, setUser] = useState(initialState.user);
  const [loading] = useState(initialState.loading);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        const gamificationResponse = await axios.get(`${API_BASE_URL}/api/moods/gamification`);
        if (gamificationResponse.data.gamification) {
          userData.gamification = gamificationResponse.data.gamification;
        }
      } catch (gamificationError) {
        console.warn('Failed to fetch gamification data:', gamificationError);
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (name, email, password, role = 'student', parentPhone = '') => {
    try {
      setError(null);
      const payload = { name, email, password, role };
      if (role === 'parent' && parentPhone) {
        payload.parentPhone = parentPhone;
      }

      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, payload);

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  }), [user, loading, error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
