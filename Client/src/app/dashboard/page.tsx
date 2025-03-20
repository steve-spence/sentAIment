"use client";

import { DashboardLayout } from "../../components/dashboard";
import { StockCard } from "@/components/stock-card";
import { PortfolioBalance } from "@/components/portfolio-balance";
import { PortfolioChart } from "@/components/portfolio-chart";
import { MarketSnapshot } from "@/components/market-snapshot";
import { Watchlist } from "@/components/watchlist";
import { stocks, portfolioData, marketSnapshot } from "@/lib/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/components/auth-Provider';

interface User {
  id: string;
  username: string;
  email: string;
  watchlist: string[];
}

export default function Dashboard() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const response = await fetch(`http://localhost:3003/api/users/${user.id}`);
          const data = await response.json();
          console.log(data);
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      console.log('No authenticated user found, redirecting to login');
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // If not authenticated or no user data, return null (redirect will happen)
  if (!authUser || !userData) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* User welcome message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Hello, {userData.username}!</h1>
        </div>

        {/* Rest of your dashboard content */}
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
        
        {/* Balance and Analytics */}
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
        
        {/* Market Data and Watchlist */}
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
            <Watchlist userId={userData.id} watchlist={userData.watchlist} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
