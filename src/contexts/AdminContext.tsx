import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AdminUser {
  email: string;
  name: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'admin@darulattar.com',
  password: 'admin123',
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('darulAttarAdmin');
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem('darulAttarAdmin');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('https://ecommerce-backend-puce.vercel.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const user = { email, name: data.name || 'Admin' };
        localStorage.setItem('darulAttarAdmin', JSON.stringify(user));
        if (data.token) localStorage.setItem('darulAttarAdminToken', data.token);
        setAdmin(user);
        return true;
      }
    } catch {
      // Backend not available, fallback to local credentials
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const user = { email, name: 'Admin' };
      localStorage.setItem('darulAttarAdmin', JSON.stringify(user));
      setAdmin(user);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('darulAttarAdmin');
    localStorage.removeItem('darulAttarAdminToken');
    setAdmin(null);
  }, []);

  return (
    <AdminContext.Provider value={{ admin, isAdmin: !!admin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
