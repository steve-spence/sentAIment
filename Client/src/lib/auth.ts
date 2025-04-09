"use client"

import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3001/api';

export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

export const signup = async (username: string, email: string, password: string) => {
  let authData = null;

  try {
    // First, create the user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          watchlist: [] // Initialize empty watchlist
        }
      }
    });

    if (authError) throw authError;
    authData = data;

    // If auth signup was successful, create user in public schema
    if (authData?.user) {
      // Create user in our backend
      const response = await fetch(`${API_URL}/users/${authData.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user in database');
      }

      const responseData = await response.json();
      console.log('User created in database:', responseData);
    }

    return authData;
  } catch (err) {
    console.error('Signup error:', err);
    // If there was an error, attempt to delete the Supabase Auth user
    if (err && authData?.user) {
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteErr) {
        console.error('Failed to cleanup auth user after database error:', deleteErr);
      }
    }
    throw err;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error('Logout error:', err);
    throw err;
  }
};

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    console.error('Get session error:', err);
    throw err;
  }
};
