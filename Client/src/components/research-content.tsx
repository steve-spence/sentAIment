"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockCard } from "@/components/stock-card";
import { TradingViewChart } from "@/components/trading-view-chart";
import dataStorage from "@/lib/dataStorage";

interface StockInfo {
  cik_str: number;
  ticker: string;
  title: string;
}

export function ResearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockInfo | null>(null);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!query) return;

      setLoading(true);
      try {
        // Initialize stock data in localStorage
        dataStorage();

        // Get stock info from localStorage
        const stocksStr = localStorage.getItem(query.toUpperCase());
        if (stocksStr) {
          const stockInfo = JSON.parse(stocksStr);
          setStockData(stockInfo);

          // Fetch current quote for the stock
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote/${query.toUpperCase()}`);
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
  }, [query]);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Research</h1>
        <p>Please enter a stock symbol to search.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Research Results for "{query}"</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !stockData ? (
        <Card>
          <CardContent className="p-6">
            <p>No stock found for symbol "{query}"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Stock Card */}
          <div className="max-w-sm mx-auto">
            {quote && (
              <StockCard
                symbol={stockData.ticker}
                name={stockData.title}
                currentValue={quote.c}
                percentChange={quote.dp}
              />
            )}
          </div>

          {/* Stock Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingViewChart symbol={query.toUpperCase()} />
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Card>
            <CardHeader>
              <CardTitle>{stockData.title} ({stockData.ticker})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium mb-2">Company Information</h3>
                  <p>CIK: {stockData.cik_str}</p>
                </div>
                
                {quote && (
                  <div>
                    <h3 className="font-medium mb-2">Market Data</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 