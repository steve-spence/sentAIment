"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/components/auth-Provider';
import { DashboardLayout } from "@/components/dashboard";
import { StockCard } from "@/components/stock-card";
import { PortfolioBalance } from "@/components/portfolio-balance";
import { PortfolioChart } from "@/components/portfolio-chart";
import { MarketSnapshot } from "@/components/market-snapshot";
import { Watchlist } from "@/components/watchlist";
import { stocks, portfolioData, marketSnapshot } from "@/lib/data";

interface User {
  data: {
    id: string;
    username: string;
    email: string;
    watchlist: {
      symbol: string[];
    };
  };
}

interface Quote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
}

interface StockQuotes {
  [symbol: string]: Quote;
}

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockQuotes, setStockQuotes] = useState<StockQuotes>({});
  const [quotesLoading, setQuotesLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!authUser?.id) {
        console.log('No authUser.id available');
        setLoading(false);
        return;
      }

      console.log('Fetching user data for ID:', authUser.id);
      try {
        const response = await fetch(`http://localhost:8080/api/users/${authUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        console.log('Received user data:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [authUser?.id]);

  // Fetch stock quotes for watchlist
  useEffect(() => {
    async function fetchStockQuotes() {
      if (!userData?.data?.watchlist?.symbol || userData.data.watchlist.symbol.length === 0) {
        return;
      }

      setQuotesLoading(true);
      const quotes: StockQuotes = {};

      try {
        for (const symbol of userData.data.watchlist.symbol) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote/${symbol}`);
          if (response.ok) {
            const quote = await response.json();
            quotes[symbol] = quote;
          }
        }
        setStockQuotes(quotes);
      } catch (error) {
        console.error('Error fetching stock quotes:', error);
      } finally {
        setQuotesLoading(false);
      }
    }

    fetchStockQuotes();
  }, [userData?.data?.watchlist?.symbol]);

  // Log whenever userData changes
  useEffect(() => {
    console.log('Dashboard userData state:', userData);
  }, [userData]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Hello, {userData?.data?.username}!</h1>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">My Stocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {quotesLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !userData?.data?.watchlist?.symbol ? (
              <div className="col-span-full text-center text-muted-foreground p-4">
                No stocks in watchlist
              </div>
            ) : (
              userData.data.watchlist.symbol.map((symbol) => {
                const quote = stockQuotes[symbol];
                return quote ? (
                  <StockCard
                    key={symbol}
                    symbol={symbol}
                    name={symbol}
                    currentValue={quote.c}
                    percentChange={quote.dp}
                  />
                ) : null;
              })
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PortfolioBalance 
              balance={portfolioData.balance}
              percentChange={portfolioData.percentChange}
              invested={portfolioData.invested}
            />
          </div>
          <div className="lg:col-span-2">
            <PortfolioChart 
              data={portfolioData.chartData}
              currentValue={portfolioData.balance}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <MarketSnapshot 
              prevClose={marketSnapshot.prevClose}
              open={marketSnapshot.open}
              dayLow={marketSnapshot.dayLow}
              dayHigh={marketSnapshot.dayHigh}
              weekLow={marketSnapshot.weekLow}
              weekHigh={marketSnapshot.weekHigh}
              tradeTime={marketSnapshot.tradeTime}
              tradeDate={marketSnapshot.tradeDate}
            />
          </div>
          <div className="lg:col-span-2">
            <Watchlist userData={userData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
