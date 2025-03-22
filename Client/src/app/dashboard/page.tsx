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
  id: string;
  username: string;
  email: string;
  watchlist: string[];
}

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-2xl font-bold">Hello, {userData.username}!</h1>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">My Stocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                name={stock.name}
                symbol={stock.symbol}
                currentValue={stock.currentValue}
                percentChange={stock.percentChange}
                chartData={stock.chartData}
                logo={stock.logo}
              />
            ))}
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
