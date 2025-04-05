"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradingViewChart } from "@/components/trading-view-chart";
import { StockCard } from "@/components/stock-card";
import dataStorage from "@/lib/dataStorage";

interface StockInfo {
  cik_str: number;
  ticker: string;
  title: string;
}

export function TradingContent() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || 'AAPL'; // Default to AAPL if no symbol provided
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockInfo | null>(null);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        // Initialize stock data in localStorage
        dataStorage();

        // Get stock info from localStorage
        const stocksStr = localStorage.getItem(symbol);
        if (stocksStr) {
          const stockInfo = JSON.parse(stocksStr);
          setStockData(stockInfo);

          // Fetch current quote for the stock
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote/${symbol}`);
          if (response.ok) {
            const quoteData = await response.json();
            setQuote(quoteData);
          }
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        {/* Stock Card */}
        {!loading && quote && stockData && (
          <div className="max-w-sm mx-auto">
            <StockCard
              symbol={stockData.ticker}
              name={stockData.title}
              currentValue={quote.c}
              percentChange={quote.dp}
            />
          </div>
        )}

        {/* Stock Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Price Chart - {symbol}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewChart symbol={symbol} />
          </CardContent>
        </Card>

        {/* Market Data */}
        {!loading && quote && (
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-medium">${quote.c.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p className={`text-lg font-medium ${quote.dp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quote.dp >= 0 ? '+' : ''}{quote.dp.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Day High</p>
                  <p className="text-lg font-medium">${quote.h.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Day Low</p>
                  <p className="text-lg font-medium">${quote.l.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-lg font-medium">${quote.o.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Previous Close</p>
                  <p className="text-lg font-medium">${quote.pc.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 