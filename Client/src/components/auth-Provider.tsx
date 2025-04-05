"use client";

import { useState, useEffect, createContext, useContext } from 'react';

import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { login, signup, logout } from '../lib/auth';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

// Auth Context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login: async (email: string, password: string) => {
      try {
        setError(null);
        const result = await login(email, password);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    signup: async (username: string, email: string, password: string) => {
      try {
        setError(null);
        const result = await signup(username, email, password);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    logout: async () => {
      try {
        setError(null);
        await logout();
        setUser(null);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 


