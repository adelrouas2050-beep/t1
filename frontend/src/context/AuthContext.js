import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../mock/data';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('rider'); // 'rider' or 'driver'

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setUserType(savedUserType || 'rider');
    }
  }, []);

  const login = (email, password, type = 'rider') => {
    // Mock login - in real app, this would call backend API
    setUser(mockUser);
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('userType', type);
    return { success: true };
  };

  const register = (userData, type = 'rider') => {
    // Mock register - in real app, this would call backend API
    const newUser = {
      ...mockUser,
      ...userData,
      id: 'user_' + Date.now()
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('userType', type);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType('rider');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      userType,
      login,
      register,
      logout,
      updateUser,
      setUserType
    }}>
      {children}
    </AuthContext.Provider>
  );
};