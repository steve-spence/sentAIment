"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

interface User {
  id: string;
  username: string;
  email: string;
  watchlist: string[];
}

export function Watchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Function to fetch the current watchlist
  const fetchWatchlist = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/stocks/${userId}`);
      console.log('Watchlist API response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch watchlist:', response.status);
        return [];
      }

      const data = await response.json();
      console.log('Watchlist data from API:', data);
      
      // Extract the symbols array from the nested structure
      const stockList = data["list of stocks"]?.symbol;
      console.log('Extracted stock list:', stockList);
      
      return Array.isArray(stockList) ? stockList : [];
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  };

  // Load user data and watchlist
  useEffect(() => {
    async function loadUserData() {
      try {
        // Step 1: Get Supabase user
        const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser();
        
        if (supabaseError || !supabaseUser) {
          console.error('Supabase auth error:', supabaseError);
          setWatchlist([]); // Ensure empty array if no user
          return;
        }

        console.log('Supabase user:', supabaseUser);

        // Step 2: Get user data from our API
        const response = await fetch(`${API_URL}/users/${supabaseUser.id}`);
        console.log('User API response status:', response.status);

        if (!response.ok) {
          console.error('API error:', response.status);
          setWatchlist([]); // Ensure empty array on error
          return;
        }

        const data = await response.json();
        console.log('User data from API:', data);

        // Handle both possible response formats
        const userData = data.data || data;
        
        if (userData && userData.id) {
          console.log('Setting user data:', userData);
          setUser(userData);
          
          // Step 3: Fetch current watchlist
          const currentWatchlist = await fetchWatchlist(userData.id);
          console.log('Setting watchlist:', currentWatchlist);
          setWatchlist(currentWatchlist);
        } else {
          console.error('Invalid user data:', userData);
          toast.error('Failed to load user data');
          setWatchlist([]); // Ensure empty array on invalid data
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
        setWatchlist([]); // Ensure empty array on error
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []); // No dependencies needed as this only runs once on mount

  const addToWatchlist = async () => {
    if (!newSymbol.trim() || !user?.id) {
      console.error('Cannot add to watchlist:', { newSymbol, userId: user?.id });
      return;
    }
    
    setIsAdding(true);
    try {
      const symbol = newSymbol.toUpperCase();
      console.log('Adding symbol:', symbol, 'for user:', user.id);

      // Create new watchlist with added symbol
      const updatedWatchlist = [...watchlist, symbol];
      
      const response = await fetch(`${API_URL}/stocks/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: updatedWatchlist })
      });

      if (response.ok) {
        // After successful update, fetch the current watchlist
        const currentWatchlist = await fetchWatchlist(user.id);
        if (currentWatchlist !== null) {
          setWatchlist(currentWatchlist);
        } else {
          setWatchlist(updatedWatchlist);
        }
        setNewSymbol('');
        toast.success(`Added ${symbol} to watchlist`);
      } else {
        const errorText = await response.text();
        console.error('Failed to update watchlist:', errorText);
        toast.error('Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromWatchlist = async (symbolToRemove: string) => {
    if (!user?.id) {
      console.error('Cannot remove from watchlist: no user ID');
      return;
    }
    
    try {
      // Create new watchlist without the removed symbol
      const updatedWatchlist = watchlist.filter(s => s !== symbolToRemove);
      
      const response = await fetch(`${API_URL}/stocks/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: updatedWatchlist })
      });

      if (response.ok) {
        // After successful update, fetch the current watchlist
        const currentWatchlist = await fetchWatchlist(user.id);
        if (currentWatchlist !== null) {
          setWatchlist(currentWatchlist);
        } else {
          setWatchlist(updatedWatchlist);
        }
        toast.success(`Removed ${symbolToRemove} from watchlist`);
      } else {
        const errorText = await response.text();
        console.error('Failed to update watchlist:', errorText);
        toast.error('Failed to remove from watchlist');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add stock symbol..."
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAdding) {
                addToWatchlist();
              }
            }}
            disabled={isLoading || isAdding || !user}
          />
          <Button 
            onClick={addToWatchlist}
            disabled={isLoading || isAdding || !newSymbol.trim() || !user}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !user ? (            <div className="text-center text-muted-foreground p-4">
              Error loading user data
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No stocks in watchlist
            </div>
          ) : (
            watchlist.map((symbol) => (
              <div 
                key={symbol}
                className="flex items-center justify-between p-2 bg-secondary rounded-md"
              >
                <span>{symbol}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWatchlist(symbol)}
                  disabled={isAdding}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 