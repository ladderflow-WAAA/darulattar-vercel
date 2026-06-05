import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAndSetSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userMeta = session.user.user_metadata || {};
      setAdmin({ email: session.user.email || '', name: userMeta.name || 'Admin' });
    } else {
      setAdmin(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAndSetSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userMeta = session.user.user_metadata || {};
        setAdmin({ email: session.user.email || '', name: userMeta.name || 'Admin' });
      } else {
        setAdmin(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAndSetSession]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
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
