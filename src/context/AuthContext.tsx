"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  loginUser, 
  storeAuthToken, 
  storeUserData, 
  getAuthToken,
  getUserData,
  logoutUser as apiLogoutUser,
  LoginRequest
} from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { fullName: string; role: string } | null;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const userData = getUserData();
        
        if (token && userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Handles user login
   * @param credentials - Email and password
   * @returns Success status and message
   */
  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(credentials);
      
      if (response.status && response.code === 200 && response.data) {
        // Store auth data
        storeAuthToken(response.data.token);
        storeUserData({
          fullName: response.data.fullName,
          role: response.data.role
        });
        
        // Update state
        setIsAuthenticated(true);
        setUser({
          fullName: response.data.fullName,
          role: response.data.role
        });
        
        // Redirect based on role
        if (response.data.role === 'ADMIN') {
          router.push('/adminDashboard');
        } else {
          router.push('/dashboard');
        }
        
        return { success: true, message: 'Login successful' };
      } else {
        setError(response.message || 'Login failed. Please try again.');
        return { success: false, message: response.message || 'Login failed. Please try again.' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles user logout
   */
  const logout = () => {
    apiLogoutUser();
    setIsAuthenticated(false);
    setUser(null);
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
 