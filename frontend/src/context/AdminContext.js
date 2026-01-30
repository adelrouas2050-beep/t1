import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, mockDrivers, mockRestaurants, mockRides, mockOrders, mockPromotions, mockStats } from '../mock/data';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [language, setLanguage] = useState('ar');
  const [currency, setCurrency] = useState('SAR');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Data states
  const [users, setUsers] = useState(mockUsers);
  const [drivers, setDrivers] = useState(mockDrivers);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [rides, setRides] = useState(mockRides);
  const [orders, setOrders] = useState(mockOrders);
  const [promotions, setPromotions] = useState(mockPromotions);
  const [stats] = useState(mockStats);

  const login = useCallback((email, password) => {
    // Mock login - in real app, call API
    if (email === 'admin@transfers.com' && password === 'admin123') {
      setIsAuthenticated(true);
      setAdmin({ name: 'مدير النظام', email, role: 'super_admin' });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdmin(null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    document.documentElement.dir = language === 'ar' ? 'ltr' : 'rtl';
  }, [language]);

  // CRUD Operations
  const updateUserStatus = useCallback((userId, status) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  }, []);

  const updateDriverStatus = useCallback((driverId, status) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status } : d));
  }, []);

  const verifyDriver = useCallback((driverId) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, verified: true } : d));
  }, []);

  const updateRestaurantStatus = useCallback((restaurantId, status) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, status } : r));
  }, []);

  const addPromotion = useCallback((promotion) => {
    const newPromo = { ...promotion, id: `P00${promotions.length + 1}`, used: 0 };
    setPromotions(prev => [...prev, newPromo]);
  }, [promotions.length]);

  const updatePromotionStatus = useCallback((promoId, status) => {
    setPromotions(prev => prev.map(p => p.id === promoId ? { ...p, status } : p));
  }, []);

  const value = {
    isAuthenticated,
    admin,
    language,
    currency,
    sidebarCollapsed,
    users,
    drivers,
    restaurants,
    rides,
    orders,
    promotions,
    stats,
    login,
    logout,
    toggleSidebar,
    toggleLanguage,
    setCurrency,
    updateUserStatus,
    updateDriverStatus,
    verifyDriver,
    updateRestaurantStatus,
    addPromotion,
    updatePromotionStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
