"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

// User types
export interface User {
  id: string;
  email: string;
  watchlist: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we have a user in Supabase session on initial load and subscribe to auth state changes
  useEffect(() => {
    // Set initial loading state
    setLoading(true);
    
    // Function to set user data from Supabase user
    const setUserFromSession = async (session: any) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      
      // Create user object from session
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        watchlist: []
      });
    };
    
    // Get initial session
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Set user if we have a session
        await setUserFromSession(session);
      } catch (err) {
        console.error('Error checking initial session:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Check initial session
    checkInitialSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true);
        await setUserFromSession(session);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function with Supabase
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        throw signInError;
      }
      
      console.log('Login successful:', data);
      
      if (data.user) {
        // Set user immediately for faster UI updates
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          watchlist: []
        });
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Signup function with Supabase
  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Register the user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      console.log('Signup successful:', data);
      
      if (data.user) {
        // Set user immediately for faster UI updates
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          watchlist: []
        });
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'An error occurred during signup');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function with Supabase
  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear user state immediately
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 