"use client";

import { createClient } from '@supabase/supabase-js';
// Use environment variables in a real production app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
console.log(supabaseUrl)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

interface User {
  id: string;
  username: string;
  email: string;
  watchlist: string[];
}



export async function createUser(id: string, email: string, username: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, email, username }),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const { user } = await response.json();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}
