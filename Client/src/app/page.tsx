import { DashboardLayout } from "./dashboard-layout";
import { StockCard } from "@/components/stock-card";
import { PortfolioBalance } from "@/components/portfolio-balance";
import { PortfolioChart } from "@/components/portfolio-chart";
import { Watchlist } from "@/components/watchlist";
import { MarketSnapshot } from "@/components/market-snapshot";
import { stocks, watchlistItems, portfolioData, marketSnapshot } from "@/lib/data";
import { ProtectedRoute } from "@/components/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* My Stocks */}
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
              <Watchlist items={watchlistItems} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
