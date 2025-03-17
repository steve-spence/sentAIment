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

  // Check if we have a user in Supabase session on initial load
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        

      } catch (err) {
        console.error('Session error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Get initial session
    getSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Get the user profile when signed in
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          watchlist: profile?.watchlist || []
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setLoading(false);
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
      
      // User is set by the onAuthStateChange listener
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
      
      // User is set by the onAuthStateChange listener
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
      
      // User is cleared by the onAuthStateChange listener
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