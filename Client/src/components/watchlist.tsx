"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

interface WatchlistProps {
  userId: string;
  watchlist: string[];
}

export function Watchlist({ userId, watchlist: initialWatchlist }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<string[]>(initialWatchlist || []);
  const [newSymbol, setNewSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setWatchlist(initialWatchlist || []);
  }, [initialWatchlist]);

  const fetchWatchlist = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching watchlist for user:", userId);
      
      const response = await fetch(`${API_URL}/stocks/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received watchlist data:", data);
        setWatchlist(data.watchlist || []);
      } else {
        console.error('Failed to fetch watchlist:', await response.text());
        toast.error('Failed to load watchlist');
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast.error('Error loading watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = async () => {
    if (!newSymbol.trim() || !userId) return;
    
    setIsAdding(true);
    try {
      console.log("Adding symbol to watchlist:", newSymbol.toUpperCase(), "for user:", userId);
      
      const response = await fetch(`${API_URL}/stocks/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({ symbol: newSymbol.toUpperCase() })
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.watchlist || []);
        setNewSymbol('');
        toast.success(`Added ${newSymbol.toUpperCase()} to watchlist`);
        
        // Refresh the watchlist after a short delay
        setTimeout(fetchWatchlist, 500);
      } else {
        console.error('Failed to update watchlist:', await response.text());
        toast.error('Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast.error('An error occurred while updating the watchlist');
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    if (!userId) return;
    
    try {
      console.log("Removing symbol from watchlist:", symbol, "for user:", userId);
      
      const response = await fetch(`${API_URL}/stocks/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({ symbol })
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.watchlist || []);
        toast.success(`Removed ${symbol} from watchlist`);
        
        // Refresh the watchlist after a short delay
        setTimeout(fetchWatchlist, 500);
      } else {
        console.error('Failed to update watchlist:', await response.text());
        toast.error('Failed to remove from watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast.error('An error occurred while updating the watchlist');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Add stock symbol (e.g. AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addToWatchlist();
              }}
            />
            <Button 
              onClick={addToWatchlist} 
              size="sm"
              disabled={isAdding || !newSymbol.trim()}
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No stocks in your watchlist yet.</p>
              <p className="text-sm mt-1">Add symbols to track them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((symbol) => (
                <div key={symbol} className="flex items-center justify-between py-2 border-b">
                  <div className="font-medium">{symbol}</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFromWatchlist(symbol)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 