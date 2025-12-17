import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const API_BASE_URL = 'https://ecommerce-backend-puce.vercel.app/api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleGoogleCredentialResponse: (response: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/user`, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          if (!response.ok) {
             throw new Error('Session expired');
          }
          const userData = await response.json();
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, [logout]);


  const handleGoogleCredentialResponse = async (response: any) => {
    const { credential } = response;
    
    try {
      const apiResponse = await fetch(`${API_BASE_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      });

      const contentType = apiResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Authentication service unavailable.');
      }
      
      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.msg || 'Google Sign-In failed');
      }
      
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      console.error("Auth Error:", error);
      throw error;
    }
  };


  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    handleGoogleCredentialResponse,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};