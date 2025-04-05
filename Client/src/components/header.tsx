"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-Provider";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  watchlist: string[];
}

const handleLogout = async () => {
  await supabase.auth.signOut();
};

export function Header() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Encode the search query for the URL
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      router.push(`/research?q=${encodedQuery}`);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/users/${authUser.id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch user data:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
          return;
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        if (data.data) {
          console.log('Setting user data:', data.data);
          setUser(data.data);
        } else {
          console.error('User data not found in response. Full response:', data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserData();
    }
  }, [authUser?.id, authLoading]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          Investment AI
        </Link>
        
        <form onSubmit={handleSearch} className="flex-1 mx-10 max-w-md">
          <Input 
            type="search" 
            placeholder="Search for stocks (e.g., AAPL, GOOGL)" 
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </form>
        
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm hover:text-primary">
            Dashboard
          </Link>
          <Link href="/portfolio" className="text-sm hover:text-primary">
            Portfolio
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </button>
              <span className="text-sm font-medium">{user.username}</span>
            </div>
          ) : (
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}