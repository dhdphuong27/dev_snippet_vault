import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { accessToken, username: userName } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify({ username: userName }));
      
      // Update state
      setToken(accessToken);
      setUser({ username: userName });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      await authAPI.register({ username, email, password });
      
      // Auto-login after registration
      return await login(username, password);
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated - FIXED: Changed to arrow function
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,  // ✅ Make sure this is included
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};