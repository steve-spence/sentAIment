"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";


const API_URL = process.env.NEXT_PUBLIC_API_URL

interface User {
  data: {
    id: string;
    username: string;
    email: string;
    watchlist: string[];
  };
}

interface WatchlistProps {
  userData: User | null;
}

export function Watchlist({ userData }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Update watchlist when userData changes
  useEffect(() => {
    console.log('Raw userData in Watchlist:', userData);
    console.log('userData?.data?.watchlist:', userData?.data?.watchlist);
    
    if (userData?.data?.watchlist) {
      console.log('Setting watchlist from symbol array:', userData.data.watchlist);
      setWatchlist(userData.data.watchlist);
    } else {
      console.log('Setting empty watchlist');
      setWatchlist([]);
    }
  }, [userData]);

  // Log whenever watchlist state changes
  useEffect(() => {
    console.log('Current watchlist state:', watchlist);
  }, [watchlist]);

  const addToWatchlist = async () => {
    if (!newSymbol.trim() || !userData?.data?.id) {
      console.error('Cannot add to watchlist:', { newSymbol, userId: userData?.data?.id });
      return;
    }

    // Check if adding would exceed the limit
    if (watchlist.length >= 5) {
      toast.error('Watchlist cannot contain more than 5 stocks');
      return;
    }
    
    setIsAdding(true);
    try {
      const symbol = newSymbol.toUpperCase();
      console.log('Adding symbol:', symbol, 'for user:', userData.data.id);

      // Create new watchlist with added symbol
      const updatedWatchlist = [...watchlist, symbol];
      
      const response = await fetch(`${API_URL}/stocks/${userData.data.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWatchlist)
      });

      if (response.ok) {
        setWatchlist(updatedWatchlist);
        setNewSymbol('');
        toast.success(`Added ${symbol} to watchlist`);
      } else {
        const errorData = await response.json();
        console.error('Failed to update watchlist:', errorData);
        toast.error(errorData.error || 'Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromWatchlist = async (symbolToRemove: string) => {
    if (!userData?.data?.id) {
      console.error('Cannot remove from watchlist: no user ID');
      return;
    }
    
    try {
      // Create new watchlist without the removed symbol
      const updatedWatchlist = watchlist.filter(s => s !== symbolToRemove);
      
      const response = await fetch(`${API_URL}/stocks/${userData.data.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWatchlist)
      });

      if (response.ok) {
        setWatchlist(updatedWatchlist);
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
            disabled={isAdding || !userData}
          />
          <Button 
            onClick={addToWatchlist}
            disabled={isAdding || !newSymbol.trim() || !userData}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2">

          {isAdding ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !userData ? (            
              
              <div className="text-center text-muted-foreground p-4">

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