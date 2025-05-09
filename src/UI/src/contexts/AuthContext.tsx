
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../services/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { config } from '@/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const tokenKey = config.auth.tokenKey;

  useEffect(() => {
    // On initial load, check if user is already authenticated
    const initAuth = async () => {
      const storedToken = localStorage.getItem(tokenKey);
      const storedUser = localStorage.getItem('user_data');
      
      console.log('Auth init - Token exists:', !!storedToken);
      console.log('Auth init - User data exists:', !!storedUser);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
          localStorage.removeItem('user_data');
        }
      }
      
      await checkAuth();
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      console.log('No token found in localStorage');
      return false;
    }

    try {
      console.log('Validating existing token');
      const response = await authService.getCurrentUser();
      const userData = response.data?.data || response.data?.user;
      
      if (userData) {
        console.log('Token validation successful, user:', userData);
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      }
      console.log('Token validation failed - no user data returned');
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid authentication data
      localStorage.removeItem(tokenKey);
      localStorage.removeItem('user_data');
      setUser(null);
      return false;
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    setLoading(true);
    try {
      console.log('Auth service login attempt with username:', credentials.username);
      const response = await authService.login(credentials);
      
      console.log('Auth service login response:', response.status);
      
      // Check if response contains expected data
      const userData = response.data?.data?.user || response.data?.user;
      if (!userData) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username || userData.email || 'user'}!`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      let errorMsg = 'Login failed. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive",
      });
      
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('Logging out user');
      await authService.logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      toast({
        title: 'Logout issue',
        description: 'There was an issue with the logout process, but you have been logged out locally',
        variant: "warning",
      });
    } finally {
      // Always clear local state regardless of API result
      localStorage.removeItem(tokenKey);
      localStorage.removeItem('user_data');
      setUser(null);
      setLoading(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      checkAuth,
      isAuthenticated: !!user 
    }}>
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
