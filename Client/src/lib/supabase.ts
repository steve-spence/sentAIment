import { createClient } from '@supabase/supabase-js';

// Use environment variables in a real production app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ausydguaxrvhilspunoz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1c3lkZ3VheHJ2aGlsc3B1bm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwMDQ5MDQsImV4cCI6MjAyOTU4MDkwNH0._Uy06WKXYPKhWZUOmjQxkO4rXHJUn1S5_YpLvPwzw2Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 