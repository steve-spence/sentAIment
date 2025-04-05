"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export function WatchlistDebug() {
  const [userId, setUserId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        addLog(`Retrieved user ID: ${data.user.id}`);
      }
    };
    
    getUserId();
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testGetWatchlist = async () => {
    if (!userId) {
      addLog('No user ID available');
      return;
    }
    
    setIsLoading(true);
    addLog(`Testing GET watchlist for user: ${userId}`);
    
    try {
      const response = await fetch(`${API_URL}/stocks/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
      
      const data = await response.json();
      addLog(`GET response: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`GET error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAddStock = async () => {
    if (!userId) {
      addLog('No user ID available');
      return;
    }
    
    setIsLoading(true);
    const symbol = "DEBUG" + Math.floor(Math.random() * 1000);
    addLog(`Testing ADD stock ${symbol} for user: ${userId}`);
    
    try {
      const response = await fetch(`${API_URL}/stocks/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({ symbol })
      });
      
      const data = await response.json();
      addLog(`ADD response: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`ADD error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Watchlist Debug</CardTitle>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={testGetWatchlist}
            disabled={isLoading || !userId}
          >
            Test GET
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={testAddStock}
            disabled={isLoading || !userId}
          >
            Test ADD
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={clearLogs}
          >
            Clear Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500">No logs yet</div>
          ) : (
            <div className="space-y-1 text-xs font-mono">
              {logs.map((log, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 