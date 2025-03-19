"use client";

import { DashboardLayout } from "../../components/dashboard";
import { StockCard } from "@/components/stock-card";
import { PortfolioBalance } from "@/components/portfolio-balance";
import { PortfolioChart } from "@/components/portfolio-chart";
import { MarketSnapshot } from "@/components/market-snapshot";
import { stocks,  portfolioData, marketSnapshot } from "@/lib/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/components/auth-Provider'




const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  console.log(data?.user.id)
  return data?.user.id
}



export default function Dashboard() {
  const { user, loading } = useAuth();


  const router = useRouter(); 

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      console.log('No authenticated user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);


  // Show loading state while checking authentication
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // If not loading and no user, return null (redirect will happen)
  if (!user) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* User welcome message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, {}!</h1>
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
            {/* <Watchlist items={watchlistItems} /> */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
