import React, { createContext, useContext, useState, useEffect } from 'react';
import autoService from '../services/authService'; // Import your authentication service

const AuthContext = createContext(null);

// Custom hook for authntication context
export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    // Load userId from localStorag 
    return localStorage.getItem('userId') || null;
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if user authenticated
        const id = await autoService.isAuthenticated();
        if (id) {
          setUserId(id);          
          localStorage.setItem('userId', id);
        }
      } catch (error) {
        setUserId(null);
        localStorage.removeItem('userId'); 
      }
    };
    
    if (!userId) {
      checkAuthentication();
    }
  }, [userId]);

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId'); // Clear 
  };

  return (
    <AuthContext.Provider value={{ userId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
